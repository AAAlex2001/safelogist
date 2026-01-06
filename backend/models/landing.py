"""
Модели для лендинга (CMS-контент)
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, UniqueConstraint

from models.base import Base


class LandingHero(Base):
    """Hero секция лендинга (мультиязычная)"""
    __tablename__ = "landing_hero"
    __table_args__ = (
        UniqueConstraint("locale", name="uq_landing_hero_locale"),
    )

    id = Column(Integer, primary_key=True, index=True)
    locale = Column(String(10), nullable=False, index=True)

    # Заголовки
    title = Column(String, nullable=False)
    title_highlight = Column(String, nullable=True)  # Подсвеченная часть заголовка
    subtitle = Column(String, nullable=False)

    # Статистика: Компании
    stat_companies_label = Column(String, nullable=False)
    stat_companies_value = Column(Integer, nullable=False)
    stat_companies_suffix = Column(String(20), nullable=True)

    # Статистика: Отзывы
    stat_reviews_label = Column(String, nullable=False)
    stat_reviews_value = Column(Integer, nullable=False)
    stat_reviews_suffix = Column(String(20), nullable=True)

    # Статистика: Страны
    stat_countries_label = Column(String, nullable=False)
    stat_countries_value = Column(Integer, nullable=False)
    stat_countries_suffix = Column(String(20), nullable=True)

    # Статистика: Источники
    stat_sources_label = Column(String, nullable=False)
    stat_sources_value = Column(Integer, nullable=False)
    stat_sources_suffix = Column(String(20), nullable=True)

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self):
        return f"<LandingHero(id={self.id}, locale='{self.locale}')>"
