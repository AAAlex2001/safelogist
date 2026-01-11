"""
Сервис для работы с отзывами и компаниями
"""
from typing import List, Optional, Tuple, Dict
from urllib.parse import quote
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from models.review import Review
from models.company import Company
from schemas.reviews import CompanyListItem, CompanySearchResult


class ReviewsService:
    """Сервис для работы с отзывами"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_companies_page(
        self, page: int, per_page: int = 10
    ) -> Tuple[List[CompanyListItem], bool]:
        """Получить страницу компаний — всё из таблицы Company, без GROUP BY"""
        offset = (page - 1) * per_page

        query = (
            select(Company.name, Company.reviews_count, Company.min_review_id)
            .limit(per_page + 1)
            .offset(offset)
        )
        result = await self.db.execute(query)
        rows = result.all()

        has_next = len(rows) > per_page
        if has_next:
            rows = rows[:per_page]

        companies = [
            CompanyListItem(
                company_name=row.name,
                company_slug=quote(row.name, safe=''),
                company_id=row.min_review_id,
                reviews_count=row.reviews_count or 0
            )
            for row in rows
        ]

        return companies, has_next

    async def search_companies(
        self, query: str, limit: int = 10
    ) -> List[CompanySearchResult]:
        """Поиск компаний — всё из таблицы Company"""
        pattern = f'%{query}%'

        search_query = (
            select(Company.name, Company.min_review_id)
            .where(Company.name.ilike(pattern))
            .limit(limit)
        )
        result = await self.db.execute(search_query)
        rows = result.all()

        return [
            CompanySearchResult(name=row.name, id=row.min_review_id)
            for row in rows
        ]

    async def search_companies_with_stats(
        self, query: str, limit: int = 50
    ) -> List[CompanyListItem]:
        """Поиск компаний с количеством отзывов — всё из таблицы Company"""
        pattern = f'%{query}%'

        search_query = (
            select(Company.name, Company.reviews_count, Company.min_review_id)
            .where(Company.name.ilike(pattern))
            .limit(limit)
        )
        result = await self.db.execute(search_query)
        rows = result.all()

        return [
            CompanyListItem(
                company_name=row.name,
                company_slug=quote(row.name, safe=''),
                company_id=row.min_review_id,
                reviews_count=row.reviews_count or 0
            )
            for row in rows
        ]

    async def get_company_by_review_id(self, review_id: int) -> Optional[Company]:
        """Получить компанию по ID отзыва"""
        # Сначала находим название компании по review_id
        name_query = select(Review.subject).where(Review.id == review_id)
        name_result = await self.db.execute(name_query)
        company_name = name_result.scalar()

        if not company_name:
            return None

        # Получаем данные компании из кэша
        company_query = select(Company).where(Company.name == company_name)
        company_result = await self.db.execute(company_query)
        return company_result.scalar()

    async def get_company_name_by_review_id(self, review_id: int) -> Optional[str]:
        """Получить название компании по ID отзыва"""
        query = select(Review.subject).where(Review.id == review_id)
        result = await self.db.execute(query)
        return result.scalar()

    async def get_company_reviews_count(self, company_name: str) -> int:
        """Получить количество отзывов компании с комментариями"""
        query = select(func.count(Review.id)).where(
            Review.subject == company_name,
            Review.comment.isnot(None),
            Review.comment != ''
        )
        result = await self.db.execute(query)
        return result.scalar() or 0

    async def get_company_reviews(
        self, company_name: str, page: int, per_page: int = 10
    ) -> List[Review]:
        """Получить отзывы компании с пагинацией (только с комментариями)"""
        offset = (page - 1) * per_page

        query = (
            select(Review)
            .where(Review.subject == company_name)
            .where(Review.comment.isnot(None))
            .where(Review.comment != '')
            .order_by(Review.review_date.desc())
            .limit(per_page)
            .offset(offset)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_reviewer_ids(self, reviewer_names: List[str]) -> Dict[str, int]:
        """Получить ID для списка reviewer'ов — из таблицы Company"""
        if not reviewer_names:
            return {}

        query = (
            select(Company.name, Company.min_review_id)
            .where(Company.name.in_(reviewer_names))
        )
        result = await self.db.execute(query)
        return {row.name: row.min_review_id for row in result.all() if row.min_review_id}

    async def get_min_review_id_for_company(self, company_name: str) -> Optional[int]:
        """Получить минимальный ID отзыва для компании — из таблицы Company"""
        query = select(Company.min_review_id).where(Company.name == company_name)
        result = await self.db.execute(query)
        return result.scalar()

    async def get_company_avg_rating(self, company_name: str) -> Optional[float]:
        """
        Получить среднюю оценку компании по всем отзывам.
        Для источника ATI, если рейтинг не указан, считается как 5.
        """
        from sqlalchemy import case, func as sql_func
        
        # Используем CASE: если rating не NULL - берем его,
        # если NULL и source='ATI' - берем 5, иначе NULL (не учитываем)
        rating_expr = case(
            (Review.rating.isnot(None), Review.rating),
            (sql_func.upper(Review.source) == 'ATI', 5),
            else_=None
        )
        
        query = (
            select(func.avg(rating_expr))
            .where(Review.subject == company_name)
            .where(
                (Review.rating.isnot(None)) | 
                (sql_func.upper(Review.source) == 'ATI')
            )
        )
        result = await self.db.execute(query)
        avg = result.scalar()
        return float(avg) if avg is not None else None

    async def get_company_jurisdiction(self, company_name: str) -> Optional[str]:
        """Получить юрисдикцию компании из любого отзыва"""
        query = (
            select(Review.jurisdiction)
            .where(Review.subject == company_name)
            .where(Review.jurisdiction.isnot(None))
            .where(Review.jurisdiction != "")
            .where(Review.jurisdiction != "—")
            .limit(1)
        )
        result = await self.db.execute(query)
        return result.scalar()

    async def get_available_report_years(self, company_name: str) -> List[int]:
        """Получить список доступных годов отчетов для компании"""
        query = (
            select(Review.report_year)
            .where(Review.subject == company_name)
            .where(Review.report_year.isnot(None))
            .distinct()
            .order_by(Review.report_year.desc())
        )
        result = await self.db.execute(query)
        return [row[0] for row in result.all()]

    async def get_company_review_by_year(self, company_name: str, year: int) -> Optional[Review]:
        """Получить отзыв компании за конкретный год"""
        query = (
            select(Review)
            .where(Review.subject == company_name)
            .where(Review.report_year == year)
            .limit(1)
        )
        result = await self.db.execute(query)
        return result.scalars().first()
