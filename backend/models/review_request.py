from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, DateTime, Enum, Text, ForeignKey
from sqlalchemy.orm import relationship

from models.base import Base


class ReviewRequestStatus(str, PyEnum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class ReviewRequest(Base):
    __tablename__ = "review_requests"

    id = Column(Integer, primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    from_company = Column(String, nullable=False, index=True)
    target_company = Column(String, nullable=False, index=True)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=False)
    
    attachment_path = Column(String, nullable=True)
    attachment_name = Column(String, nullable=True)
    
    status = Column(Enum(ReviewRequestStatus), default=ReviewRequestStatus.PENDING, nullable=False, index=True)
    admin_comment = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    user = relationship("User", foreign_keys=[user_id])

    def __repr__(self):
        return f"<ReviewRequest(id={self.id}, from='{self.from_company}', to='{self.target_company}', status='{self.status}')>"
