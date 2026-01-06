"""
Pydantic схемы для лендинга
"""
from typing import Optional
from pydantic import BaseModel, Field


class HeroContentOut(BaseModel):
    """Ответ с контентом Hero секции"""
    locale: str

    title: str
    title_highlight: Optional[str] = None
    subtitle: str

    stat_companies_label: str
    stat_companies_value: int
    stat_companies_suffix: Optional[str] = None

    stat_reviews_label: str
    stat_reviews_value: int
    stat_reviews_suffix: Optional[str] = None

    stat_countries_label: str
    stat_countries_value: int
    stat_countries_suffix: Optional[str] = None

    stat_sources_label: str
    stat_sources_value: int
    stat_sources_suffix: Optional[str] = None

    class Config:
        from_attributes = True


class HeroContentUpsert(BaseModel):
    """Данные для создания/обновления Hero секции"""
    title: str = Field(..., min_length=1)
    title_highlight: Optional[str] = None
    subtitle: str = Field(..., min_length=1)

    stat_companies_label: str = Field(..., min_length=1)
    stat_companies_value: int = Field(..., ge=0)
    stat_companies_suffix: Optional[str] = None

    stat_reviews_label: str = Field(..., min_length=1)
    stat_reviews_value: int = Field(..., ge=0)
    stat_reviews_suffix: Optional[str] = None

    stat_countries_label: str = Field(..., min_length=1)
    stat_countries_value: int = Field(..., ge=0)
    stat_countries_suffix: Optional[str] = None

    stat_sources_label: str = Field(..., min_length=1)
    stat_sources_value: int = Field(..., ge=0)
    stat_sources_suffix: Optional[str] = None
