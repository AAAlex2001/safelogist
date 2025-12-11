"""
Модель для отзывов о компаниях
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Text
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
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    def __repr__(self):
        return f"<Review(id={self.id}, subject='{self.subject}', rating={self.rating})>"

