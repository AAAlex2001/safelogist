"""
Схемы для системы регистрации
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from enum import Enum
from pydantic import EmailStr



# ============================================================================
# Registration
# ============================================================================


class UserRole(str, Enum):
    TRANSPORT_COMPANY = "TRANSPORT_COMPANY"
    CARGO_OWNER = "CARGO_OWNER"
    FORWARDER = "FORWARDER"
    USER = "USER"


class UserRegistration(BaseModel):
    "модель валидации пользователя"
    first_name: str = Field(..., description="Имя пользователя")
    role: UserRole = Field(..., description="Роль пользователя")
    phone: str = Field(..., description="Номер телефона пользователя")
    password: str = Field(..., description="Пароль пользователя")
    email: EmailStr = Field(..., description="Почта пользователя")


class UserResponse(BaseModel):
    "модель для ответа на фронтенд"
    id: int
    name: str | None = None
    role: UserRole
    email: EmailStr
    phone: str
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# Email Verification (for registration)
# ============================================================================


class EmailCodeRequest(BaseModel):
    """Запрос на отправку кода верификации email"""
    email: EmailStr = Field(..., description="Email для верификации")


class EmailCodeVerify(BaseModel):
    """Проверка кода верификации email"""
    email: EmailStr = Field(..., description="Email для верификации")
    code: str = Field(..., description="6-значный код верификации")
