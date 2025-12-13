"""
Схемы для отзывов и компаний
"""
from typing import Optional, List
from pydantic import BaseModel


class CompanyListItem(BaseModel):
    """Компания в списке"""
    company_name: str
    company_slug: str
    company_id: Optional[int]
    reviews_count: int


class CompanySearchResult(BaseModel):
    """Результат поиска компании"""
    name: str
    id: Optional[int]


class ReviewItem(BaseModel):
    """Отзыв для отображения"""
    comment: str
    reviewer: str
    reviewer_id: Optional[int]
    source: str
    rating: int
    date: str


class CompanySection(BaseModel):
    """Секция информации о компании"""
    title: str
    rows: List[dict]


class PaginatedCompanies(BaseModel):
    """Результат пагинации компаний"""
    companies: List[CompanyListItem]
    has_next: bool
    current_page: int


class SearchCompaniesResponse(BaseModel):
    """Ответ API поиска"""
    companies: List[CompanySearchResult]
