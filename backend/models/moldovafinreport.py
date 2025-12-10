"""
Модель для финансовых отчетов Молдовы (MoldovaFinReport)
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.dialects.postgresql import JSONB

from models.base import Base


class MoldovaFinReport(Base):
    """Финансовый отчет компании из Молдовы"""
    __tablename__ = "moldovafinreport"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False, index=True)
    fiscal_code = Column(String, nullable=False, index=True)
    report_type = Column(String, nullable=False, index=True)
    report_year = Column(Integer, nullable=False, index=True)
    
    # JSON поля - используем JSONB для PostgreSQL (более эффективен для запросов)
    detail_data = Column(JSONB, nullable=True)
    detailed_data = Column(JSONB, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    def __repr__(self):
        return f"<MoldovaFinReport(id={self.id}, company_name='{self.company_name}', report_type='{self.report_type}', report_year={self.report_year})>"

