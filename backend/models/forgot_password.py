from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base


class PasswordResetCode(Base):
    """
    Универсальная таблица для кодов верификации:
    - Сброс пароля: user_id заполнен, email = NULL
    - Регистрация: user_id = NULL, email заполнен
    """
    __tablename__ = "password_reset_codes"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # nullable для регистрации
    email = Column(String, nullable=True, index=True)  # для верификации при регистрации
    code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="password_reset_codes")
