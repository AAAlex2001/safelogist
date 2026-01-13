"""
API для админки
"""
from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
import os
import uuid
from pathlib import Path

from database import get_db
from models.user import User, UserRole
from models.company_claim import CompanyClaim, ClaimStatus
from models.review_request import ReviewRequest, ReviewRequestStatus
from services.review_request_service import ReviewRequestService
from services.landing.hero_service import HeroService
from services.landing import LandingService
from schemas.landing import (
    HeroContentOut,
    HeroContentUpsert,
    ReviewCtaOut,
    ReviewCtaUpsert,
    FunctionsOut,
    FunctionsUpsert,
    StepsOut,
    StepsUpsert,
    StepsCardOut,
    StepsCardCreate,
    StepsCardUpdate,
    ReviewsOut,
    ReviewsUpsert,
    ReviewItemOut,
    ReviewItemCreate,
    ReviewItemUpdate,
    BotOut,
    BotUpsert,
    TariffsOut,
    TariffsUpsert,
    FaqOut,
    FaqUpsert,
)
from fastapi import HTTPException

router = APIRouter(prefix="/api/admin", tags=["admin"])


class UserResponse(BaseModel):
    """Пользователь для админки"""
    id: int
    email: str
    phone: str
    name: Optional[str]
    company_name: Optional[str]
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedUsersResponse(BaseModel):
    """Список пользователей с пагинацией"""
    items: List[UserResponse]
    total: int
    page: int
    limit: int
    pages: int


class StatsResponse(BaseModel):
    """Статистика для админки"""
    total_users: int
    active_users: int
    pending_claims: int
    approved_claims: int
    pending_reviews: int
    approved_reviews: int


@router.get("/stats", response_model=StatsResponse)
async def get_stats(db: AsyncSession = Depends(get_db)):
    """Получить статистику"""
    total_users = await db.execute(select(func.count(User.id)))
    active_users = await db.execute(
        select(func.count(User.id)).where(User.is_active == True)
    )
    pending_claims = await db.execute(
        select(func.count(CompanyClaim.id)).where(CompanyClaim.status == ClaimStatus.PENDING)
    )
    approved_claims = await db.execute(
        select(func.count(CompanyClaim.id)).where(CompanyClaim.status == ClaimStatus.APPROVED)
    )
    pending_reviews = await db.execute(
        select(func.count(ReviewRequest.id)).where(ReviewRequest.status == ReviewRequestStatus.PENDING)
    )
    approved_reviews = await db.execute(
        select(func.count(ReviewRequest.id)).where(ReviewRequest.status == ReviewRequestStatus.APPROVED)
    )

    return StatsResponse(
        total_users=total_users.scalar() or 0,
        active_users=active_users.scalar() or 0,
        pending_claims=pending_claims.scalar() or 0,
        approved_claims=approved_claims.scalar() or 0,
        pending_reviews=pending_reviews.scalar() or 0,
        approved_reviews=approved_reviews.scalar() or 0
    )


@router.get("/users", response_model=PaginatedUsersResponse)
async def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Список пользователей с пагинацией"""
    offset = (page - 1) * limit

    # Базовый запрос для подсчета
    count_query = select(func.count(User.id))

    # Базовый запрос для данных
    query = select(User).order_by(User.created_at.desc())

    if search:
        pattern = f"%{search}%"
        search_filter = (
            (User.email.ilike(pattern)) |
            (User.name.ilike(pattern)) |
            (User.company_name.ilike(pattern))
        )
        count_query = count_query.where(search_filter)
        query = query.where(search_filter)

    # Получаем общее количество
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Получаем данные с пагинацией
    query = query.limit(limit).offset(offset)
    result = await db.execute(query)
    users = result.scalars().all()

    # Вычисляем общее количество страниц
    pages = (total + limit - 1) // limit if total > 0 else 1

    return PaginatedUsersResponse(
        items=users,
        total=total,
        page=page,
        limit=limit,
        pages=pages
    )


@router.patch("/users/{user_id}/toggle-active")
async def toggle_user_active(user_id: int, db: AsyncSession = Depends(get_db)):
    """Включить/выключить пользователя"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar()
    if not user:
        return {"error": "User not found"}

    user.is_active = not user.is_active
    await db.commit()

    return {"id": user.id, "is_active": user.is_active}


class ReviewRequestResponse(BaseModel):
    id: int
    user_id: int
    from_company: str
    target_company: str
    rating: int
    comment: str
    attachment_path: Optional[str] = None
    attachment_name: Optional[str] = None
    status: str
    admin_comment: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


@router.get("/review-requests", response_model=List[ReviewRequestResponse])
async def list_review_requests(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    offset = (page - 1) * limit
    query = select(ReviewRequest).order_by(ReviewRequest.created_at.desc())

    if status:
        try:
            status_enum = ReviewRequestStatus(status.upper())
            query = query.where(ReviewRequest.status == status_enum)
        except ValueError:
            pass

    query = query.limit(limit).offset(offset)
    result = await db.execute(query)
    requests = result.scalars().all()

    return [
        ReviewRequestResponse(
            id=r.id,
            user_id=r.user_id,
            from_company=r.from_company,
            target_company=r.target_company,
            rating=r.rating,
            comment=r.comment,
            attachment_path=r.attachment_path,
            attachment_name=r.attachment_name,
            status=r.status.value,
            admin_comment=r.admin_comment,
            created_at=r.created_at,
            updated_at=r.updated_at
        )
        for r in requests
    ]


@router.get("/review-requests/{request_id}", response_model=ReviewRequestResponse)
async def get_review_request(request_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ReviewRequest).where(ReviewRequest.id == request_id))
    r = result.scalar()

    if not r:
        return {"error": "Request not found"}

    return ReviewRequestResponse(
        id=r.id,
        user_id=r.user_id,
        from_company=r.from_company,
        target_company=r.target_company,
        rating=r.rating,
        comment=r.comment,
        attachment_path=r.attachment_path,
        attachment_name=r.attachment_name,
        status=r.status.value,
        admin_comment=r.admin_comment,
        created_at=r.created_at,
        updated_at=r.updated_at
    )


@router.post("/review-requests/{request_id}/approve")
async def approve_review_request(
    request_id: int,
    admin_comment: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    service = ReviewRequestService(db)
    review = await service.approve_request(request_id, admin_comment)

    if not review:
        return {"error": "Request not found"}

    return {"message": "Отзыв одобрен и опубликован", "review_id": review.id}


@router.post("/review-requests/{request_id}/reject")
async def reject_review_request(
    request_id: int,
    admin_comment: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    service = ReviewRequestService(db)
    success = await service.reject_request(request_id, admin_comment)

    if not success:
        return {"error": "Request not found"}

    return {"message": "Заявка отклонена"}


@router.delete("/review-requests/{request_id}")
async def delete_review_request(request_id: int, db: AsyncSession = Depends(get_db)):
    service = ReviewRequestService(db)
    success = await service.delete_request(request_id)

    if not success:
        return {"error": "Request not found"}

    return {"message": "Заявка удалена"}


# ===================== ВСЕ ОТЗЫВЫ (таблица reviews) =====================

from models.review import Review
from models.company import Company
from urllib.parse import quote


# === КОМПАНИИ (быстрый список из таблицы companies) ===

class CompanyListItemResponse(BaseModel):
    """Компания из таблицы companies"""
    name: str
    slug: str
    reviews_count: int
    min_review_id: int

    class Config:
        from_attributes = True


class PaginatedCompaniesResponse(BaseModel):
    companies: List[CompanyListItemResponse]
    page: int
    per_page: int
    has_next: bool


@router.get("/companies", response_model=PaginatedCompaniesResponse)
async def get_companies_list(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Получить список компаний с пагинацией (быстро из таблицы companies)"""
    offset = (page - 1) * per_page

    query = select(Company.name, Company.reviews_count, Company.min_review_id)

    if search:
        pattern = f"%{search}%"
        query = query.where(Company.name.ilike(pattern))

    query = query.limit(per_page + 1).offset(offset)
    result = await db.execute(query)
    rows = result.all()

    has_next = len(rows) > per_page
    if has_next:
        rows = rows[:per_page]

    companies = [
        CompanyListItemResponse(
            name=row.name,
            slug=quote(row.name, safe=''),
            reviews_count=row.reviews_count or 0,
            min_review_id=row.min_review_id or 0
        )
        for row in rows
    ]

    return PaginatedCompaniesResponse(
        companies=companies,
        page=page,
        per_page=per_page,
        has_next=has_next
    )


@router.get("/companies/{company_name}/reviews")
async def get_company_reviews(
    company_name: str,
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db)
):
    """Получить все отзывы конкретной компании для редактирования"""
    from urllib.parse import unquote
    decoded_name = unquote(company_name)
    
    offset = (page - 1) * per_page

    # Считаем общее кол-во
    count_query = select(func.count(Review.id)).where(Review.subject == decoded_name)
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Получаем отзывы
    query = (
        select(Review)
        .where(Review.subject == decoded_name)
        .order_by(Review.created_at.desc())
        .limit(per_page)
        .offset(offset)
    )
    result = await db.execute(query)
    reviews = result.scalars().all()

    return {
        "company_name": decoded_name,
        "reviews": [
            {
                "id": r.id,
                "review_id": r.review_id,
                "subject": r.subject,
                "comment": r.comment,
                "reviewer": r.reviewer,
                "rating": r.rating,
                "status": r.status,
                "review_date": r.review_date.isoformat() if r.review_date else None,
                "source": r.source,
                "jurisdiction": r.jurisdiction,
                "country": r.country,
                "company_number": r.company_number,
                "registration_number": r.registration_number,
                "registration_date": r.registration_date,
                "legal_form": r.legal_form,
                "short_name": r.short_name,
                "cin": r.cin,
                "authorized_capital": r.authorized_capital,
                "paid_up_capital": r.paid_up_capital,
                "subtype": r.subtype,
                "activity_type": r.activity_type,
                "legal_address": r.legal_address,
                "mailing_address": r.mailing_address,
                "ogrn": r.ogrn,
                "inn": r.inn,
                "liquidation_date": r.liquidation_date,
                "managers": r.managers,
                "branch": r.branch,
                "fiscal_code": r.fiscal_code,
                "report_type": r.report_type,
                "report_year": r.report_year,
                "detail_data": r.detail_data,
                "detailed_data": r.detailed_data,
                "cuiio": r.cuiio,
                "email": r.email,
                "phone": r.phone,
                "postal_code": r.postal_code,
                "street_address": r.street_address,
                "caem_code": r.caem_code,
                "caem_name": r.caem_name,
                "cfoj_code": r.cfoj_code,
                "cfoj_name": r.cfoj_name,
                "cfp_code": r.cfp_code,
                "cfp_name": r.cfp_name,
                "employees_count": r.employees_count,
                "accountant": r.accountant,
                "accountant_phone": r.accountant_phone,
                "responsible_person": r.responsible_person,
                "report_status": r.report_status,
                "is_audited": r.is_audited,
                "declaration_date": r.declaration_date,
                "web": r.web,
                "cuatm_code": r.cuatm_code,
                "cuatm_name": r.cuatm_name,
                "entity_type": r.entity_type,
                "liquidation": r.liquidation,
                "period_from": r.period_from,
                "period_to": r.period_to,
                "signed": r.signed,
                "report_create_date": r.report_create_date,
                "report_update_date": r.report_update_date,
                "fiscal_date": r.fiscal_date,
                "economic_agent_id": r.economic_agent_id,
                "import_file_name": r.import_file_name,
                "employees_abs": r.employees_abs,
                "organization_id": r.organization_id,
                "organization_name": r.organization_name,
                "fisc": r.fisc,
                "legal_entity_id": r.legal_entity_id,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in reviews
        ],
        "total": total,
        "page": page,
        "per_page": per_page,
        "has_next": offset + len(reviews) < total
    }


# === ОТДЕЛЬНЫЕ ОТЗЫВЫ (CRUD) ===

class ReviewResponse(BaseModel):
    """Отзыв из таблицы reviews"""
    id: int
    subject: str
    review_id: str
    comment: Optional[str] = None
    reviewer: Optional[str] = None
    rating: Optional[int] = None
    status: Optional[str] = None
    review_date: Optional[datetime] = None
    source: Optional[str] = None
    jurisdiction: Optional[str] = None
    country: Optional[str] = None
    company_number: Optional[str] = None
    registration_number: Optional[str] = None
    registration_date: Optional[str] = None
    legal_form: Optional[str] = None
    short_name: Optional[str] = None
    cin: Optional[str] = None
    authorized_capital: Optional[str] = None
    paid_up_capital: Optional[str] = None
    subtype: Optional[str] = None
    activity_type: Optional[str] = None
    legal_address: Optional[str] = None
    mailing_address: Optional[str] = None
    ogrn: Optional[str] = None
    inn: Optional[str] = None
    liquidation_date: Optional[str] = None
    managers: Optional[str] = None
    branch: Optional[str] = None
    fiscal_code: Optional[str] = None
    report_type: Optional[str] = None
    report_year: Optional[int] = None
    detail_data: Optional[dict] = None
    detailed_data: Optional[dict] = None
    cuiio: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    postal_code: Optional[str] = None
    street_address: Optional[str] = None
    caem_code: Optional[str] = None
    caem_name: Optional[str] = None
    cfoj_code: Optional[str] = None
    cfoj_name: Optional[str] = None
    cfp_code: Optional[str] = None
    cfp_name: Optional[str] = None
    employees_count: Optional[str] = None
    accountant: Optional[str] = None
    accountant_phone: Optional[str] = None
    responsible_person: Optional[str] = None
    report_status: Optional[str] = None
    is_audited: Optional[bool] = None
    declaration_date: Optional[str] = None
    web: Optional[str] = None
    cuatm_code: Optional[str] = None
    cuatm_name: Optional[str] = None
    entity_type: Optional[str] = None
    liquidation: Optional[bool] = None
    period_from: Optional[str] = None
    period_to: Optional[str] = None
    signed: Optional[bool] = None
    report_create_date: Optional[str] = None
    report_update_date: Optional[str] = None
    fiscal_date: Optional[str] = None
    economic_agent_id: Optional[str] = None
    import_file_name: Optional[str] = None
    employees_abs: Optional[str] = None
    organization_id: Optional[str] = None
    organization_name: Optional[str] = None
    fisc: Optional[str] = None
    legal_entity_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedReviewsResponse(BaseModel):
    reviews: List[ReviewResponse]
    total: int
    page: int
    per_page: int


@router.get("/reviews", response_model=PaginatedReviewsResponse)
async def get_all_reviews(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Получить все отзывы с пагинацией"""
    offset = (page - 1) * per_page

    count_query = select(func.count(Review.id))
    query = select(Review).order_by(Review.created_at.desc())

    if search:
        pattern = f"%{search}%"
        search_filter = (
            (Review.subject.ilike(pattern)) |
            (Review.reviewer.ilike(pattern)) |
            (Review.inn.ilike(pattern)) |
            (Review.ogrn.ilike(pattern))
        )
        count_query = count_query.where(search_filter)
        query = query.where(search_filter)

    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    query = query.limit(per_page).offset(offset)
    result = await db.execute(query)
    reviews = result.scalars().all()

    return PaginatedReviewsResponse(
        reviews=reviews,
        total=total,
        page=page,
        per_page=per_page
    )


@router.get("/reviews/{review_id}", response_model=ReviewResponse)
async def get_review(review_id: int, db: AsyncSession = Depends(get_db)):
    """Получить один отзыв по ID"""
    result = await db.execute(select(Review).where(Review.id == review_id))
    review = result.scalar()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


class ReviewUpdateRequest(BaseModel):
    """Запрос на обновление отзыва - все поля опциональные"""
    subject: Optional[str] = None
    comment: Optional[str] = None
    reviewer: Optional[str] = None
    rating: Optional[int] = None
    status: Optional[str] = None
    source: Optional[str] = None
    jurisdiction: Optional[str] = None
    country: Optional[str] = None
    company_number: Optional[str] = None
    registration_number: Optional[str] = None
    registration_date: Optional[str] = None
    legal_form: Optional[str] = None
    short_name: Optional[str] = None
    cin: Optional[str] = None
    authorized_capital: Optional[str] = None
    paid_up_capital: Optional[str] = None
    subtype: Optional[str] = None
    activity_type: Optional[str] = None
    legal_address: Optional[str] = None
    mailing_address: Optional[str] = None
    ogrn: Optional[str] = None
    inn: Optional[str] = None
    liquidation_date: Optional[str] = None
    managers: Optional[str] = None
    branch: Optional[str] = None
    fiscal_code: Optional[str] = None
    report_type: Optional[str] = None
    report_year: Optional[int] = None
    detail_data: Optional[dict] = None
    detailed_data: Optional[dict] = None
    cuiio: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    postal_code: Optional[str] = None
    street_address: Optional[str] = None
    caem_code: Optional[str] = None
    caem_name: Optional[str] = None
    cfoj_code: Optional[str] = None
    cfoj_name: Optional[str] = None
    cfp_code: Optional[str] = None
    cfp_name: Optional[str] = None
    employees_count: Optional[str] = None
    accountant: Optional[str] = None
    accountant_phone: Optional[str] = None
    responsible_person: Optional[str] = None
    report_status: Optional[str] = None
    is_audited: Optional[bool] = None
    declaration_date: Optional[str] = None
    web: Optional[str] = None
    cuatm_code: Optional[str] = None
    cuatm_name: Optional[str] = None
    entity_type: Optional[str] = None
    liquidation: Optional[bool] = None
    period_from: Optional[str] = None
    period_to: Optional[str] = None
    signed: Optional[bool] = None
    report_create_date: Optional[str] = None
    report_update_date: Optional[str] = None
    fiscal_date: Optional[str] = None
    economic_agent_id: Optional[str] = None
    employees_abs: Optional[str] = None
    organization_id: Optional[str] = None
    organization_name: Optional[str] = None
    fisc: Optional[str] = None
    legal_entity_id: Optional[str] = None


@router.patch("/reviews/{review_id}")
async def update_review(
    review_id: int,
    data: ReviewUpdateRequest,
    db: AsyncSession = Depends(get_db)
):
    """Обновить отзыв"""
    result = await db.execute(select(Review).where(Review.id == review_id))
    review = result.scalar()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if hasattr(review, field):
            setattr(review, field, value)

    await db.commit()
    await db.refresh(review)
    return {"message": "Отзыв обновлён", "id": review.id}


@router.delete("/reviews/{review_id}")
async def delete_review(review_id: int, db: AsyncSession = Depends(get_db)):
    """Удалить отзыв"""
    result = await db.execute(select(Review).where(Review.id == review_id))
    review = result.scalar()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    await db.delete(review)
    await db.commit()
    return {"message": "Отзыв удалён"}


# ===================== LANDING HERO =====================

@router.get("/landing/hero", response_model=HeroContentOut)
async def admin_get_hero(
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    """Получить Hero контент для локали."""
    service = HeroService(db)
    hero = await service.get_by_locale(lang)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero content not found")
    return hero


@router.put("/landing/hero", response_model=HeroContentOut)
async def admin_upsert_hero(
    payload: HeroContentUpsert,
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    """Создать или обновить Hero контент."""
    service = HeroService(db)
    hero = await service.upsert(lang, payload)
    return hero


# ===================== LANDING SECTIONS =====================

@router.get("/landing/review-cta", response_model=ReviewCtaOut)
async def admin_get_review_cta(
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    cta = await service.get_review_cta(lang)
    if not cta:
        raise HTTPException(status_code=404, detail="ReviewCta content not found")
    return cta


@router.put("/landing/review-cta", response_model=ReviewCtaOut)
async def admin_upsert_review_cta(
    payload: ReviewCtaUpsert,
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    return await service.upsert_review_cta(lang, payload)


@router.get("/landing/functions", response_model=FunctionsOut)
async def admin_get_functions(
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    functions = await service.get_functions(lang)
    if not functions:
        raise HTTPException(status_code=404, detail="Functions content not found")
    return functions


@router.put("/landing/functions", response_model=FunctionsOut)
async def admin_upsert_functions(
    payload: FunctionsUpsert,
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    return await service.upsert_functions(lang, payload)


@router.get("/landing/steps", response_model=StepsOut)
async def admin_get_steps(
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    steps = await service.get_steps(lang)
    if not steps:
        raise HTTPException(status_code=404, detail="Steps content not found")
    return steps


@router.put("/landing/steps", response_model=StepsOut)
async def admin_upsert_steps(
    payload: StepsUpsert,
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    return await service.upsert_steps(lang, payload)


@router.post("/landing/steps/upload-image")
async def upload_steps_image(
    file: UploadFile = File(...),
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    """Загрузить изображение для step2"""
    # Проверяем тип файла
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, WEBP images are allowed")

    # Создаём директорию если не существует
    upload_dir = Path("static/landing/steps")
    upload_dir.mkdir(parents=True, exist_ok=True)

    # Генерируем уникальное имя файла
    file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    unique_filename = f"step2_{lang}_{uuid.uuid4().hex[:8]}.{file_ext}"
    file_path = upload_dir / unique_filename

    # Сохраняем файл
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # Возвращаем URL изображения
    image_url = f"/static/landing/steps/{unique_filename}"

    return {"image_url": image_url, "message": "Image uploaded successfully"}


# ===== Steps Cards CRUD =====

@router.post("/landing/steps/cards", response_model=StepsCardOut)
async def create_steps_card(
    payload: StepsCardCreate,
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    return await service.create_steps_card(lang, payload)


@router.put("/landing/steps/cards/{card_id}", response_model=StepsCardOut)
async def update_steps_card(
    card_id: int,
    payload: StepsCardUpdate,
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    return await service.update_steps_card(card_id, payload)


@router.delete("/landing/steps/cards/{card_id}")
async def delete_steps_card(
    card_id: int,
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    await service.delete_steps_card(card_id)
    return {"message": "Card deleted successfully"}


@router.get("/landing/reviews", response_model=ReviewsOut)
async def admin_get_reviews(
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    reviews = await service.get_reviews(lang)
    if not reviews:
        raise HTTPException(status_code=404, detail="Reviews content not found")
    return reviews


@router.put("/landing/reviews", response_model=ReviewsOut)
async def admin_upsert_reviews(
    payload: ReviewsUpsert,
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    return await service.upsert_reviews(lang, payload)


# ===== Review Items CRUD =====

@router.post("/landing/reviews/items", response_model=ReviewItemOut)
async def create_review_item(
    payload: ReviewItemCreate,
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    return await service.create_review_item(lang, payload)


@router.put("/landing/reviews/items/{item_id}", response_model=ReviewItemOut)
async def update_review_item(
    item_id: int,
    payload: ReviewItemUpdate,
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    return await service.update_review_item(item_id, payload)


@router.delete("/landing/reviews/items/{item_id}")
async def delete_review_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    await service.delete_review_item(item_id)
    return {"message": "Review item deleted successfully"}


@router.post("/landing/reviews/items/{item_id}/upload-avatar")
async def upload_review_avatar(
    item_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    """Загрузить аватар для отзыва"""
    # Проверяем тип файла
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, WEBP images are allowed")

    # Создаём директорию если не существует
    upload_dir = Path("static/landing/reviews")
    upload_dir.mkdir(parents=True, exist_ok=True)

    # Генерируем уникальное имя файла
    file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    unique_filename = f"avatar_{item_id}_{uuid.uuid4().hex[:8]}.{file_ext}"
    file_path = upload_dir / unique_filename

    # Сохраняем файл
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # Обновляем запись в БД
    image_url = f"/static/landing/reviews/{unique_filename}"
    service = LandingService(db)
    await service.update_review_item(item_id, ReviewItemUpdate(author_avatar=image_url))

    return {"image_url": image_url}


@router.get("/landing/reviews/import-from-db")
async def get_reviews_from_db(
    db: AsyncSession = Depends(get_db),
    limit: int = 20,
):
    """Получить список компаний с отзывами для импорта (случайная выборка)"""
    from sqlalchemy import select
    from models.company import Company
    from models.review import Review

    # Берём случайные компании с отзывами
    stmt = (
        select(Company)
        .where(Company.reviews_count > 0)
        .order_by(func.random())
        .limit(limit)
    )

    result = await db.execute(stmt)
    companies = result.scalars().all()

    # Для каждой компании берём один случайный отзыв
    review_list = []
    for company in companies:
        # Берём случайный отзыв для этой компании
        review_stmt = (
            select(Review)
            .where(Review.subject == company.name)
            .order_by(func.random())
            .limit(1)
        )
        review_result = await db.execute(review_stmt)
        review = review_result.scalar()

        if review:
            review_list.append({
                "id": review.id,
                "reviewer": review.reviewer or "Аноним",
                "subject": company.name,
                "comment": review.comment or "Без комментария",
                "rating": review.rating or 0,
                "review_date": review.review_date.isoformat() if review.review_date else None,
                "source": review.source,
                "review_count": company.reviews_count,
            })

    return review_list


@router.get("/landing/bot", response_model=BotOut)
async def admin_get_bot(
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    bot = await service.get_bot(lang)
    if not bot:
        raise HTTPException(status_code=404, detail="Bot content not found")
    return bot


@router.put("/landing/bot", response_model=BotOut)
async def admin_upsert_bot(
    payload: BotUpsert,
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    return await service.upsert_bot(lang, payload)


@router.get("/landing/tariffs", response_model=TariffsOut)
async def admin_get_tariffs(
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    tariffs = await service.get_tariffs(lang)
    if not tariffs:
        raise HTTPException(status_code=404, detail="Tariffs content not found")
    return tariffs


@router.put("/landing/tariffs", response_model=TariffsOut)
async def admin_upsert_tariffs(
    payload: TariffsUpsert,
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    return await service.upsert_tariffs(lang, payload)


@router.get("/landing/faq", response_model=FaqOut)
async def admin_get_faq(
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    faq = await service.get_faq(lang)
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ content not found")
    return faq


@router.put("/landing/faq", response_model=FaqOut)
async def admin_upsert_faq(
    payload: FaqUpsert,
    lang: str = Query(..., min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    return await service.upsert_faq(lang, payload)


from models.review import Review
from models.company import Company


@router.get("/company/{company_name}")
async def get_company_info(company_name: str, db: AsyncSession = Depends(get_db)):
    """Получить информацию о компании"""
    query = select(Company).where(Company.name == company_name)
    result = await db.execute(query)
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    return {
        "name": company.name,
        "reviews_count": company.reviews_count,
        "logo": company.logo,
        "description": company.description,
        "website": company.website,
        "contact_phone": company.contact_phone,
        "contact_email": company.contact_email,
        "contact_person": company.contact_person,
    }


@router.patch("/company/{company_name}")
async def update_company_info(company_name: str, payload: dict, db: AsyncSession = Depends(get_db)):
    """Обновить информацию о компании"""
    query = select(Company).where(Company.name == company_name)
    result = await db.execute(query)
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Обновляем только разрешенные поля
    allowed_fields = ["description", "website", "contact_phone", "contact_email", "contact_person", "logo"]
    for key, value in payload.items():
        if key in allowed_fields and hasattr(company, key):
            setattr(company, key, value)
    
    await db.commit()
    await db.refresh(company)
    return {"message": "Updated successfully"}


@router.get("/reviews/company/{company_name}")
async def get_company_reviews(company_name: str, db: AsyncSession = Depends(get_db)):
    """Получить все отзывы для компании по имени"""
    query = select(Review).where(Review.subject == company_name).order_by(Review.id.desc())
    result = await db.execute(query)
    reviews = result.scalars().all()
    return [
        {
            "id": r.id,
            "subject": r.subject,
            "review_id": r.review_id,
            "comment": r.comment,
            "reviewer": r.reviewer,
            "rating": r.rating,
            "status": r.status,
            "review_date": r.review_date.isoformat() if r.review_date else None,
            "source": r.source,
            "jurisdiction": r.jurisdiction,
            "country": r.country,
            "company_number": r.company_number,
            "legal_form": r.legal_form,
            "inn": r.inn,
            "ogrn": r.ogrn,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in reviews
    ]


@router.get("/reviews/company-name-by-id/{min_review_id}")
async def get_company_name_by_id(min_review_id: int, db: AsyncSession = Depends(get_db)):
    """Получить имя компании по min_review_id"""
    query = select(Company.name).where(Company.min_review_id == min_review_id)
    result = await db.execute(query)
    company_name = result.scalar_one_or_none()
    if not company_name:
        raise HTTPException(status_code=404, detail="Company not found")
    return {"company_name": company_name}


@router.patch("/reviews/{review_id}")
async def update_review(review_id: int, payload: dict, db: AsyncSession = Depends(get_db)):
    """Обновить отзыв"""
    query = select(Review).where(Review.id == review_id)
    result = await db.execute(query)
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Обновляем все переданные поля
    for key, value in payload.items():
        if hasattr(review, key):
            setattr(review, key, value)
    
    await db.commit()
    await db.refresh(review)
    return {"message": "Updated successfully"}


@router.delete("/reviews/{review_id}")
async def delete_review(review_id: int, db: AsyncSession = Depends(get_db)):
    """Удалить отзыв"""
    query = select(Review).where(Review.id == review_id)
    result = await db.execute(query)
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    await db.delete(review)
    await db.commit()
    return {"message": "Deleted successfully"}
