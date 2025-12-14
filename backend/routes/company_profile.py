"""
API для работы с профилем компании
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from database import get_db
from models.user import User
from models.company_profile import CompanyProfile
from models.review import Review
from schemas.company_profile import CompanyProfileResponse, CompanyProfileUpdateRequest
from dependencies.auth import get_current_user


router = APIRouter(prefix="/company-profile", tags=["company_profile"])


@router.get("/my", response_model=CompanyProfileResponse)
async def get_my_company_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Получить профиль компании текущего пользователя (владельца)
    """
    query = select(CompanyProfile).where(CompanyProfile.owner_user_id == current_user.id)
    result = await db.execute(query)
    profile = result.scalars().first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="У вас нет профиля компании"
        )

    return profile


@router.get("/{company_name}", response_model=CompanyProfileResponse)
async def get_company_profile(
    company_name: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Получить профиль компании по названию (публичный доступ)
    """
    query = select(CompanyProfile).where(CompanyProfile.company_name == company_name)
    result = await db.execute(query)
    profile = result.scalars().first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Профиль компании не найден"
        )

    return profile


@router.patch("/my", response_model=CompanyProfileResponse)
async def update_my_company_profile(
    description: Optional[str] = Form(None),
    website: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    logo: UploadFile | None = File(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Обновить профиль своей компании (только для владельца)

    Изменения автоматически синхронизируются с отзывами
    """
    # Получаем профиль компании пользователя
    query = select(CompanyProfile).where(CompanyProfile.owner_user_id == current_user.id)
    result = await db.execute(query)
    profile = result.scalars().first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="У вас нет профиля компании"
        )

    # Обновляем поля
    if description is not None:
        profile.description = description
    if website is not None:
        profile.website = website
    if email is not None:
        profile.email = email
    if phone is not None:
        profile.phone = phone
    if address is not None:
        profile.address = address

    # Обработка логотипа
    if logo:
        import os
        import uuid

        UPLOAD_DIR = "static/company_logos"
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        ext = logo.filename.split(".")[-1] if logo.filename else "png"
        filename = f"{uuid.uuid4()}.{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)

        with open(filepath, "wb") as f:
            f.write(await logo.read())

        profile.logo = filename

    await db.commit()

    # Синхронизируем изменения с отзывами
    await sync_company_profile_to_reviews(db, profile)

    await db.refresh(profile)
    return profile


async def sync_company_profile_to_reviews(db: AsyncSession, profile: CompanyProfile):
    """
    Синхронизировать изменения профиля компании с отзывами

    Обновляет данные во всех отзывах, где subject = company_name
    """
    # Обновляем контактные данные в отзывах
    update_stmt = (
        update(Review)
        .where(Review.subject == profile.company_name)
        .values(
            legal_address=profile.address,
            # Можно добавить другие поля, если нужно
        )
    )

    await db.execute(update_stmt)
    await db.commit()
