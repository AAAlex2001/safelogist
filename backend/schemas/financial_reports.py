"""
Схемы для финансовых отчетов Молдовы
"""
from pydantic import BaseModel
from typing import Optional, Any


class FinancialReportItem(BaseModel):
    """Один финансовый отчет компании"""
    id: int
    company_name: str
    fiscal_code: str
    report_type: str
    report_year: int
    detail_data: Optional[Any] = None
    detailed_data: Optional[Any] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class FinancialReportsResponse(BaseModel):
    """Список финансовых отчетов компании"""
    total: int
    reports: list[FinancialReportItem] = []

