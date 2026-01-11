"""
Модель для отзывов о компаниях
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from models.base import Base


class Review(Base):
    """Отзыв о компании"""
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, nullable=False, index=True)  # Название компании
    review_id = Column(String, unique=True, nullable=False, index=True)
    comment = Column(Text, nullable=True)
    reviewer = Column(String, nullable=True)
    rating = Column(Integer, nullable=True)
    status = Column(String, nullable=True, index=True)
    review_date = Column(DateTime(timezone=True), nullable=True)
    source = Column(String, nullable=True, index=True)  # ATI, и т.д.
    # Дополнительные данные о компании
    jurisdiction = Column(String, nullable=True)
    country = Column(String, nullable=True)
    company_number = Column(String, nullable=True)
    registration_number = Column(String, nullable=True)
    registration_date = Column(String, nullable=True)
    legal_form = Column(String, nullable=True)
    short_name = Column(String, nullable=True)
    cin = Column(String, nullable=True)
    authorized_capital = Column(String, nullable=True)
    paid_up_capital = Column(String, nullable=True)
    subtype = Column(String, nullable=True)
    activity_type = Column(String, nullable=True)
    legal_address = Column(Text, nullable=True)
    ogrn = Column(String, nullable=True)
    inn = Column(String, nullable=True)
    liquidation_date = Column(String, nullable=True)
    managers = Column(Text, nullable=True)
    branch = Column(String, nullable=True)
    mailing_address = Column(Text, nullable=True)
    # Поля из moldovafinreport
    fiscal_code = Column(String, nullable=True)
    report_type = Column(String, nullable=True)
    report_year = Column(Integer, nullable=True)
    detail_data = Column(JSONB, nullable=True)
    detailed_data = Column(JSONB, nullable=True)
    # Поля из legalEntity
    cuiio = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    street_address = Column(String, nullable=True)
    caem_code = Column(String, nullable=True)
    caem_name = Column(String, nullable=True)
    cfoj_code = Column(String, nullable=True)
    cfoj_name = Column(String, nullable=True)
    cfp_code = Column(String, nullable=True)
    cfp_name = Column(String, nullable=True)
    employees_count = Column(String, nullable=True)
    accountant = Column(String, nullable=True)
    accountant_phone = Column(String, nullable=True)
    responsible_person = Column(String, nullable=True)
    report_status = Column(String, nullable=True)
    is_audited = Column(Boolean, nullable=True)
    declaration_date = Column(String, nullable=True)
    web = Column(String, nullable=True)
    cuatm_code = Column(String, nullable=True)
    cuatm_name = Column(String, nullable=True)
    entity_type = Column(String, nullable=True)
    liquidation = Column(Boolean, nullable=True)
    period_from = Column(String, nullable=True)
    period_to = Column(String, nullable=True)
    signed = Column(Boolean, nullable=True)
    report_create_date = Column(String, nullable=True)
    report_update_date = Column(String, nullable=True)
    fiscal_date = Column(String, nullable=True)
    economic_agent_id = Column(String, nullable=True)
    import_file_name = Column(String, nullable=True)
    employees_abs = Column(String, nullable=True)
    organization_id = Column(String, nullable=True)
    organization_name = Column(String, nullable=True)
    fisc = Column(String, nullable=True)
    legal_entity_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    def __repr__(self):
        return f"<Review(id={self.id}, subject='{self.subject}', rating={self.rating})>"

