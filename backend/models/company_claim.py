"""
Модель заявки на владение компанией
"""
from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, DateTime, Enum, Text, ForeignKey
from sqlalchemy.orm import relationship

from models.base import Base


class ClaimStatus(str, PyEnum):
    """Статусы заявки"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class CompanyClaim(Base):
    """Заявка на владение компанией"""
    __tablename__ = "company_claims"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    company_name = Column(String, nullable=False, index=True)

    # Данные заявителя
    last_name = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    middle_name = Column(String, nullable=True)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=False)
    position = Column(String, nullable=False)

    # Документ
    document_path = Column(String, nullable=False)

    # Статус
    status = Column(Enum(ClaimStatus), default=ClaimStatus.PENDING, nullable=False, index=True)
    reject_reason = Column(Text, nullable=True)

    # Даты
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    reviewed_at = Column(DateTime(timezone=True), nullable=True)

    # Связи
    user = relationship("User", backref="company_claims")
