from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr
from enum import Enum


class UserRole(str, Enum):
    TRANSPORT_COMPANY = "TRANSPORT_COMPANY"
    CARGO_OWNER = "CARGO_OWNER"
    FORWARDER = "FORWARDER"


# ============================================================
# 1. GET /profile  — получение данных профиля
# ============================================================

class ProfileGetResponse(BaseModel):
    id: int
    name: Optional[str]
    role: UserRole
    phone: str
    email: EmailStr

    company_name: Optional[str]
    position: Optional[str]
    location: Optional[str]
    photo: Optional[str]

    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# 2. PATCH /profile — редактирование профиля
# ============================================================

class ProfileUpdateRequest(BaseModel):
    """Поля, которые пользователь может менять"""
    name: Optional[str] = None
    company_name: Optional[str] = None
    position: Optional[str] = None
    location: Optional[str] = None


class ProfileUpdateResponse(ProfileGetResponse):
    """Ответ после обновления — тот же профиль"""
    pass


# ============================================================
# 3. POST /profile/change-password — смена пароля
# ============================================================

class ChangePasswordRequest(BaseModel):
    """Запрос на смену пароля"""
    new_password: str


class ChangePasswordResponse(BaseModel):
    """Ответ после смены пароля"""
    message: str