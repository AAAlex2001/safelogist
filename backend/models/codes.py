from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base


class VerificationCode(Base):
    """
    Универсальная таблица для кодов верификации:
    - Сброс пароля: user_id заполнен, email = NULL
    - Регистрация: user_id = NULL, email заполнен
    """
    __tablename__ = "verification_codes"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    email = Column(String, nullable=True, index=True)
    code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="verification_codes")
