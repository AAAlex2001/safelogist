"""
Схемы для работы с профилем компании
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class CompanyProfileResponse(BaseModel):
    """Ответ с данными профиля компании"""
    id: int
    company_name: str
    description: Optional[str]
    website: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    address: Optional[str]
    logo: Optional[str]
    legal_form: Optional[str]
    inn: Optional[str]
    ogrn: Optional[str]
    registration_number: Optional[str]
    country: Optional[str]
    jurisdiction: Optional[str]
    owner_user_id: Optional[int]
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CompanyProfileUpdateRequest(BaseModel):
    """Запрос на обновление профиля компании"""
    description: Optional[str] = None
    website: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
