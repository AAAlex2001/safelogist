"""
Модель профиля компании для владельцев
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from models.base import Base


class CompanyProfile(Base):
    """
    Профиль компании, которым может управлять владелец.
    Создается после одобрения заявки администратором.
    """
    __tablename__ = "company_profiles"

    id = Column(Integer, primary_key=True, index=True)

    # Название компании (из заявки или reviews)
    company_name = Column(String, nullable=False, unique=True, index=True)

    # Редактируемые поля профиля компании
    description = Column(Text, nullable=True)
    website = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    logo = Column(String, nullable=True)

    # Дополнительные поля из отзывов (для синхронизации)
    legal_form = Column(String, nullable=True)
    inn = Column(String, nullable=True)
    ogrn = Column(String, nullable=True)
    registration_number = Column(String, nullable=True)
    country = Column(String, nullable=True)
    jurisdiction = Column(String, nullable=True)

    # ID владельца (пользователь, который владеет компанией)
    owner_user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    # Связь с пользователем-владельцем
    owner = relationship("User", back_populates="owned_company_profile", foreign_keys=[owner_user_id])

    # Временные метки
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Верифицирована ли компания
    is_verified = Column(Boolean, default=False, nullable=False)

    def __repr__(self):
        return f"<CompanyProfile(id={self.id}, name='{self.company_name}', owner_id={self.owner_user_id})>"
