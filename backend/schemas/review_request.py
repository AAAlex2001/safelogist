from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ReviewRequestCreate(BaseModel):
    target_company: str = Field(..., min_length=1)
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=10)


class ReviewRequestResponse(BaseModel):
    id: int
    from_company: str
    target_company: str
    rating: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class ReviewRequestListItem(BaseModel):
    id: int
    user_id: int
    from_company: str
    target_company: str
    rating: int
    comment: str
    attachment_path: Optional[str] = None
    attachment_name: Optional[str] = None
    status: str
    admin_comment: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
