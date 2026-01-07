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
