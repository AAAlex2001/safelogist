"""
Модели пользователя
"""
from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, BigInteger, Enum
from sqlalchemy.orm import relationship

from models.base import Base


class UserRole(str, PyEnum):
    """Роли пользователей в системе"""
    TRANSPORT_COMPANY = "TRANSPORT_COMPANY"
    CARGO_OWNER = "CARGO_OWNER"
    FORWARDER = "FORWARDER"
    USER = "USER"


class User(Base):
    """Пользователь системы"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    photo = Column(String, nullable=True)
    company_name = Column(String, nullable=True, index=True)
    position = Column(String, nullable=True)
    location = Column(String, nullable=True)
    name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    password_reset_codes = relationship(
        "PasswordResetCode",
        back_populates="user",
        cascade="all, delete-orphan"
    )
