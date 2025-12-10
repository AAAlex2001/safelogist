"""
Модель для таблицы companies (кэш уникальных названий компаний)
"""
from sqlalchemy import Column, String

from models.base import Base


class Company(Base):
    """
    Кэш-таблица уникальных названий компаний.
    Используется для быстрого автопоиска.

    Обновлять периодически:
        TRUNCATE companies;
        INSERT INTO companies SELECT DISTINCT subject AS name FROM reviews;
    """
    __tablename__ = "companies"

    name = Column(String, primary_key=True, index=True)

    def __repr__(self):
        return f"<Company(name='{self.name}')>"