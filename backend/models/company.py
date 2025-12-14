"""
Модель для таблицы companies (кэш уникальных названий компаний)
"""
from sqlalchemy import Column, String, Integer

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

    def __repr__(self):
        return f"<Company(name='{self.name}', reviews={self.reviews_count})>"