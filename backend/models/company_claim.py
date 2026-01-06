"""
Модель для заявок на подтверждение компании
"""
from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, DateTime, Enum, Text

from models.base import Base
from models.user import UserRole


class ClaimStatus(str, PyEnum):
    """Статусы заявки на подтверждение компании"""
    PENDING = "PENDING"  # Ожидает рассмотрения
    APPROVED = "APPROVED"  # Одобрена
    REJECTED = "REJECTED"  # Отклонена


class CompanyClaim(Base):
    """Заявка на подтверждение компании"""
    __tablename__ = "company_claims"

    id = Column(Integer, primary_key=True, index=True)
    
    # ID компании, на которую откликается пользователь (со страницы отзывов)
    target_company_id = Column(Integer, nullable=True, index=True)
    
    # Шаг 1: Контактное лицо
    last_name = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    
    # Шаг 2: Данные о компании
    company_name = Column(String, nullable=False, index=True)
    industry = Column(Enum(UserRole), nullable=True)
    position = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)
    
    # Шаг 3: Документ
    document_path = Column(String, nullable=False)
    document_name = Column(String, nullable=False)
    
    # Статус и метаданные
    status = Column(Enum(ClaimStatus), default=ClaimStatus.PENDING, nullable=False, index=True)
    admin_comment = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    def __repr__(self):
        return f"<CompanyClaim(id={self.id}, company='{self.company_name}', status='{self.status}')>"

