"""
Модель для таблицы companies (кэш уникальных названий компаний)
"""
from sqlalchemy import Column, String, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship

from models.base import Base


class Company(Base):
    """
    Кэш-таблица уникальных названий компаний с предрассчитанной статистикой.
    Используется для быстрого автопоиска и пагинации.

    Обновлять периодически скриптом: sql/update_companies_stats.sql
    """
    __tablename__ = "companies"

    name = Column(String, primary_key=True, index=True)
    reviews_count = Column(Integer, default=0, nullable=False)
    min_review_id = Column(Integer, nullable=True, index=True)
    
    # Владелец компании (если заявка одобрена)
    owner_user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    
    # Редактируемые данные от владельца
    logo = Column(String, nullable=True)  # Путь к логотипу
    description = Column(Text, nullable=True)  # Описание компании
    website = Column(String, nullable=True)  # Сайт
    contact_phone = Column(String, nullable=True)  # Контактный телефон
    contact_email = Column(String, nullable=True)  # Контактный email
    contact_person = Column(String, nullable=True)  # Контактное лицо
    
    # Связь с пользователем-владельцем
    owner = relationship("User", foreign_keys=[owner_user_id])

    def __repr__(self):
        return f"<Company(name='{self.name}', reviews={self.reviews_count}, owner_id={self.owner_user_id})>"