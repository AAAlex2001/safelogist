"""
Сервис для работы с отзывами и компаниями
"""
from typing import List, Optional, Tuple, Dict, Any
from urllib.parse import quote
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from models.review import Review
from models.company import Company
from schemas.reviews import CompanyListItem, CompanySearchResult, ReviewItem


class ReviewsService:
    """Сервис для работы с отзывами"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_companies_page(
        self, page: int, per_page: int = 10
    ) -> Tuple[List[CompanyListItem], bool]:
        """Получить страницу компаний"""
        offset = (page - 1) * per_page

        # Берём названия из таблицы Company (кэш)
        names_query = (
            select(Company.name)
            .limit(per_page + 1)
            .offset(offset)
        )
        names_result = await self.db.execute(names_query)
        names = [row[0] for row in names_result.all()]

        has_next = len(names) > per_page
        if has_next:
            names = names[:per_page]

        if not names:
            return [], False

        # Получаем stats для компаний
        stats = await self._get_companies_stats(names)

        companies = [
            CompanyListItem(
                company_name=name,
                company_slug=quote(name, safe=''),
                company_id=stats.get(name, (0, None))[1],
                reviews_count=stats.get(name, (0, None))[0]
            )
            for name in names
        ]

        return companies, has_next

    async def search_companies(
        self, query: str, limit: int = 10
    ) -> List[CompanySearchResult]:
        """Поиск компаний по названию"""
        pattern = f'%{query}%'

        # Ищем по таблице Company
        search_query = (
            select(Company.name)
            .where(Company.name.ilike(pattern))
            .limit(limit)
        )
        result = await self.db.execute(search_query)
        names = [row[0] for row in result.all()]

        if not names:
            return []

        # Получаем min_id для компаний
        id_map = await self._get_companies_min_ids(names)

        return [
            CompanySearchResult(name=name, id=id_map.get(name))
            for name in names
        ]

    async def search_companies_with_stats(
        self, query: str, limit: int = 50
    ) -> List[CompanyListItem]:
        """Поиск компаний с подсчётом отзывов"""
        pattern = f'%{query}%'

        names_query = (
            select(Company.name)
            .where(Company.name.ilike(pattern))
            .limit(limit)
        )
        names_result = await self.db.execute(names_query)
        names = [row[0] for row in names_result.all()]

        if not names:
            return []

        stats = await self._get_companies_stats_with_id(names)

        return [
            CompanyListItem(
                company_name=name,
                company_slug=quote(name, safe=''),
                company_id=stats.get(name, (None, 0))[0],
                reviews_count=stats.get(name, (None, 0))[1]
            )
            for name in names
        ]

    async def get_company_name_by_review_id(self, review_id: int) -> Optional[str]:
        """Получить название компании по ID отзыва"""
        query = select(Review.subject).where(Review.id == review_id)
        result = await self.db.execute(query)
        return result.scalar()

    async def get_company_reviews_count(self, company_name: str) -> int:
        """Получить количество отзывов компании"""
        query = select(func.count(Review.id)).where(
            Review.subject == company_name,
            Review.comment.isnot(None)
        )
        result = await self.db.execute(query)
        return result.scalar() or 0

    async def get_company_reviews(
        self, company_name: str, page: int, per_page: int = 10
    ) -> List[Review]:
        """Получить отзывы компании с пагинацией"""
        offset = (page - 1) * per_page

        query = (
            select(Review)
            .where(Review.subject == company_name)
            .order_by(Review.review_date.desc())
            .limit(per_page)
            .offset(offset)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_reviewer_ids(self, reviewer_names: List[str]) -> Dict[str, int]:
        """Получить ID для списка reviewer'ов"""
        if not reviewer_names:
            return {}

        query = (
            select(Review.subject, func.min(Review.id).label("min_id"))
            .where(Review.subject.in_(reviewer_names))
            .group_by(Review.subject)
        )
        result = await self.db.execute(query)
        return {row.subject: row.min_id for row in result.all()}

    async def get_min_review_id_for_company(self, company_name: str) -> Optional[int]:
        """Получить минимальный ID отзыва для компании"""
        query = select(func.min(Review.id)).where(Review.subject == company_name)
        result = await self.db.execute(query)
        return result.scalar()

    async def _get_companies_stats(
        self, names: List[str]
    ) -> Dict[str, Tuple[int, Optional[int]]]:
        """Получить статистику для списка компаний (reviews_count, company_id)"""
        query = (
            select(
                Review.subject,
                func.count(Review.id).filter(Review.comment.isnot(None)).label('reviews_count'),
                func.min(Review.id).label('company_id'),
            )
            .where(Review.subject.in_(names))
            .group_by(Review.subject)
        )
        result = await self.db.execute(query)
        return {row.subject: (row.reviews_count, row.company_id) for row in result.all()}

    async def _get_companies_stats_with_id(
        self, names: List[str]
    ) -> Dict[str, Tuple[Optional[int], int]]:
        """Получить статистику для списка компаний (company_id, reviews_count)"""
        query = (
            select(
                Review.subject,
                func.min(Review.id).label("company_id"),
                func.count(Review.id).filter(Review.comment.isnot(None)).label('reviews_count')
            )
            .where(Review.subject.in_(names))
            .group_by(Review.subject)
        )
        result = await self.db.execute(query)
        return {row.subject: (row.company_id, row.reviews_count) for row in result.all()}

    async def _get_companies_min_ids(self, names: List[str]) -> Dict[str, int]:
        """Получить минимальные ID отзывов для списка компаний"""
        query = (
            select(Review.subject, func.min(Review.id).label("min_id"))
            .where(Review.subject.in_(names))
            .group_by(Review.subject)
        )
        result = await self.db.execute(query)
        return {row.subject: row.min_id for row in result.all()}
