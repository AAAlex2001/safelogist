"""
Сервис для работы с финансовыми отчетами Молдовы
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import List

from models.moldovafinreport import MoldovaFinReport
from schemas.financial_reports import FinancialReportItem, FinancialReportsResponse


class FinancialReportsService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_reports_by_fiscal_code(
        self,
        fiscal_code: str,
        limit: int = 10
    ) -> FinancialReportsResponse:
        """
        Получить финансовые отчеты компании по фискальному коду
        
        Args:
            fiscal_code: фискальный код компании (UNP)
            limit: максимальное количество отчетов
            
        Returns:
            FinancialReportsResponse с списком отчетов
        """
        # Получаем общее количество
        count_query = select(func.count(MoldovaFinReport.id)).where(
            MoldovaFinReport.fiscal_code == fiscal_code
        )
        count_result = await self.db.execute(count_query)
        total = count_result.scalar() or 0

        # Получаем отчеты (сортируем по году, новые первыми)
        query = (
            select(MoldovaFinReport)
            .where(MoldovaFinReport.fiscal_code == fiscal_code)
            .order_by(MoldovaFinReport.report_year.desc())
            .limit(limit)
        )
        result = await self.db.execute(query)
        reports = result.scalars().all()

        # Преобразуем в схему
        report_items = [
            FinancialReportItem(
                id=report.id,
                company_name=report.company_name,
                fiscal_code=report.fiscal_code,
                report_type=report.report_type,
                report_year=report.report_year,
                detail_data=report.detail_data,
                detailed_data=report.detailed_data,
                created_at=report.created_at.isoformat() if report.created_at else None,
                updated_at=report.updated_at.isoformat() if report.updated_at else None,
            )
            for report in reports
        ]

        return FinancialReportsResponse(
            total=total,
            reports=report_items
        )

