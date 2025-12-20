from fastapi import APIRouter, Depends, UploadFile, File, Form, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from database import get_db
from models.user import User
from models.review import Review
from models.company import Company
from schemas.profile import (
    ProfileGetResponse,
    ProfileUpdateResponse,
    ChangePasswordRequest,
    ChangePasswordResponse,
)
from services.profile import ProfileService
from dependencies.auth import get_current_user


router = APIRouter(prefix="/api/profile", tags=["profile"])


# ================================================================
# GET /profile — получение данных профиля
# ================================================================
@router.get("", response_model=ProfileGetResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ProfileService(db)
    return await service.get_profile(current_user.id)


# ================================================================
# PATCH /profile — редактирование профиля + фото
# ================================================================
@router.patch("", response_model=ProfileUpdateResponse)
async def update_profile(
    name: str | None = Form(None),
    role: str | None = Form(None),
    phone: str | None = Form(None),
    company_name: str | None = Form(None),
    position: str | None = Form(None),
    location: str | None = Form(None),
    photo: UploadFile | None = File(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ProfileService(db)

    data = {
        "name": name,
        "role": role,
        "phone": phone,
        "company_name": company_name,
        "position": position,
        "location": location,
    }

    updated = await service.update_profile(current_user, data, photo)
    return updated


# ================================================================
# POST /profile/change-password — смена пароля
# ================================================================
@router.post("/change-password", response_model=ChangePasswordResponse)
async def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = ProfileService(db)
    await service.change_password(current_user, data.current_password, data.new_password)
    return ChangePasswordResponse(message="Пароль успешно изменён")


# ================================================================
# GET /profile/company-reviews — получение отзывов своей компании
# ================================================================
@router.get("/company-reviews")
async def get_my_company_reviews(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Получить отзывы о компании текущего пользователя
    
    Отзывы связываются по полю company_name пользователя с полем subject в Review
    """
    if not current_user.company_name:
        return {
            "reviews": [],
            "total": 0,
            "page": page,
            "per_page": per_page,
            "total_pages": 0
        }
    
    # Получаем отзывы компании
    offset = (page - 1) * per_page
    
    query = (
        select(Review)
        .where(Review.subject == current_user.company_name)
        .order_by(Review.review_date.desc())
        .limit(per_page)
        .offset(offset)
    )
    result = await db.execute(query)
    reviews = result.scalars().all()
    
    # Получаем общее количество отзывов
    count_query = select(Company.reviews_count).where(Company.name == current_user.company_name)
    count_result = await db.execute(count_query)
    total = count_result.scalar() or 0
    
    total_pages = (total + per_page - 1) // per_page
    
    return {
        "reviews": [
            {
                "id": r.id,
                "subject": r.subject,
                "comment": r.comment,
                "reviewer": r.reviewer,
                "rating": r.rating,
                "status": r.status,
                "review_date": r.review_date,
                "source": r.source,
            }
            for r in reviews
        ],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
        "company_name": current_user.company_name
    }


# ================================================================
# GET /profile/company-info — получение данных о компании
# ================================================================
@router.get("/company-info")
async def get_my_company_info(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Получить подробную информацию о компании текущего пользователя
    
    Возвращает данные из последнего отзыва (где есть максимум полей)
    """
    if not current_user.company_name:
        return {
            "company_name": None,
            "info": None,
            "reviews_count": 0
        }
    
    # Получаем статистику компании
    company_query = select(Company).where(Company.name == current_user.company_name)
    company_result = await db.execute(company_query)
    company = company_result.scalar()
    
    # Получаем последний отзыв с максимумом данных
    review_query = (
        select(Review)
        .where(Review.subject == current_user.company_name)
        .order_by(Review.review_date.desc())
        .limit(1)
    )
    review_result = await db.execute(review_query)
    latest_review = review_result.scalar()
    
    company_info = None
    if latest_review:
        company_info = {
            "legal_form": latest_review.legal_form,
            "inn": latest_review.inn,
            "ogrn": latest_review.ogrn,
            "registration_number": latest_review.registration_number,
            "country": latest_review.country,
            "jurisdiction": latest_review.jurisdiction,
            "legal_address": latest_review.legal_address,
            "short_name": latest_review.short_name,
            "authorized_capital": latest_review.authorized_capital,
            "paid_up_capital": latest_review.paid_up_capital,
            "managers": latest_review.managers,
        }
    
    return {
        "company_name": current_user.company_name,
        "info": company_info,
        "reviews_count": company.reviews_count if company else 0
    }
