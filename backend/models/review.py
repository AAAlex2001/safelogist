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
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    def __repr__(self):
        return f"<Review(id={self.id}, subject='{self.subject}', rating={self.rating})>"

