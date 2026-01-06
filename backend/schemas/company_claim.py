"""
Схемы для заявок на подтверждение компании
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from models.company_claim import ClaimStatus


class CompanyClaimRequest(BaseModel):
    """Запрос на создание заявки (данные формы)"""
    # Шаг 1: Контактное лицо
    last_name: str = Field(..., min_length=1, max_length=100, description="Фамилия")
    first_name: str = Field(..., min_length=1, max_length=100, description="Имя")
    # middle_name removed
    phone: str = Field(..., min_length=10, max_length=20, description="Номер телефона")
    
    # Шаг 2: Данные о компании
    company_name: str = Field(..., min_length=1, max_length=200, description="Название компании")
    position: str = Field(..., min_length=1, max_length=100, description="Должность")
    email: EmailStr = Field(..., description="Электронная почта")


class CompanyClaimResponse(BaseModel):
    """Ответ после создания заявки"""
    id: int
    company_name: str
    status: str
    message: str = "Заявка успешно отправлена. Мы рассмотрим её в течение 48 часов."
    created_at: datetime

    class Config:
        from_attributes = True


class ClaimListItem(BaseModel):
    """Элемент списка заявок для админки"""
    id: int
    target_company_id: Optional[int]
    target_company_name: Optional[str] = None
    company_name: str
    last_name: str
    first_name: str
    phone: str
    email: str
    position: str
    document_path: str
    document_name: str
    status: ClaimStatus
    admin_comment: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ClaimReview(BaseModel):
    """Рассмотрение заявки (одобрить/отклонить)"""
    status: ClaimStatus
    admin_comment: Optional[str] = None

