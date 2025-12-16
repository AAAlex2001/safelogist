from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.user import User
from schemas.profile import (
    ProfileGetResponse,
    ProfileUpdateResponse,
    ChangePasswordRequest,
    ChangePasswordResponse,
)
from services.profile import ProfileService
from dependencies.auth import get_current_user


router = APIRouter(prefix="/profile", tags=["profile"])


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
