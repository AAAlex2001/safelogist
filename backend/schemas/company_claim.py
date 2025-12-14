"""
Схемы для заявок на владение компанией
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

from models.company_claim import ClaimStatus


class ClaimCreate(BaseModel):
    """Создание заявки"""
    company_name: str
    last_name: str
    first_name: str
    middle_name: Optional[str] = None
    phone: str
    email: EmailStr
    position: str


class ClaimResponse(BaseModel):
    """Ответ с данными заявки"""
    id: int
    user_id: int
    company_name: str
    last_name: str
    first_name: str
    middle_name: Optional[str]
    phone: str
    email: str
    position: str
    document_path: str
    status: ClaimStatus
    reject_reason: Optional[str]
    created_at: datetime
    reviewed_at: Optional[datetime]

    class Config:
        from_attributes = True


class ClaimReview(BaseModel):
    """Рассмотрение заявки"""
    status: ClaimStatus
    reject_reason: Optional[str] = None
