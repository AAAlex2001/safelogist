"""
API для админки
"""
from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel

from database import get_db
from models.user import User, UserRole
from models.company_claim import CompanyClaim, ClaimStatus
from models.review_request import ReviewRequest, ReviewRequestStatus
from services.review_request_service import ReviewRequestService

router = APIRouter(prefix="/api/admin", tags=["admin"])


class UserResponse(BaseModel):
    """Пользователь для админки"""
    id: int
    email: str
    phone: str
    name: Optional[str]
    company_name: Optional[str]
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class StatsResponse(BaseModel):
    """Статистика для админки"""
    total_users: int
    active_users: int
    pending_claims: int
    approved_claims: int
    pending_reviews: int
    approved_reviews: int


@router.get("/stats", response_model=StatsResponse)
async def get_stats(db: AsyncSession = Depends(get_db)):
    """Получить статистику"""
    total_users = await db.execute(select(func.count(User.id)))
    active_users = await db.execute(
        select(func.count(User.id)).where(User.is_active == True)
    )
    pending_claims = await db.execute(
        select(func.count(CompanyClaim.id)).where(CompanyClaim.status == ClaimStatus.PENDING)
    )
    approved_claims = await db.execute(
        select(func.count(CompanyClaim.id)).where(CompanyClaim.status == ClaimStatus.APPROVED)
    )
    pending_reviews = await db.execute(
        select(func.count(ReviewRequest.id)).where(ReviewRequest.status == ReviewRequestStatus.PENDING)
    )
    approved_reviews = await db.execute(
        select(func.count(ReviewRequest.id)).where(ReviewRequest.status == ReviewRequestStatus.APPROVED)
    )

    return StatsResponse(
        total_users=total_users.scalar() or 0,
        active_users=active_users.scalar() or 0,
        pending_claims=pending_claims.scalar() or 0,
        approved_claims=approved_claims.scalar() or 0,
        pending_reviews=pending_reviews.scalar() or 0,
        approved_reviews=approved_reviews.scalar() or 0
    )


@router.get("/users", response_model=List[UserResponse])
async def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Список пользователей"""
    offset = (page - 1) * limit

    query = select(User).order_by(User.created_at.desc())

    if search:
        pattern = f"%{search}%"
        query = query.where(
            (User.email.ilike(pattern)) |
            (User.name.ilike(pattern)) |
            (User.company_name.ilike(pattern))
        )

    query = query.limit(limit).offset(offset)
    result = await db.execute(query)

    return result.scalars().all()


@router.patch("/users/{user_id}/toggle-active")
async def toggle_user_active(user_id: int, db: AsyncSession = Depends(get_db)):
    """Включить/выключить пользователя"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar()
    if not user:
        return {"error": "User not found"}

    user.is_active = not user.is_active
    await db.commit()

    return {"id": user.id, "is_active": user.is_active}


class ReviewRequestResponse(BaseModel):
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


@router.get("/review-requests", response_model=List[ReviewRequestResponse])
async def list_review_requests(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    offset = (page - 1) * limit
    query = select(ReviewRequest).order_by(ReviewRequest.created_at.desc())
    
    if status:
        try:
            status_enum = ReviewRequestStatus(status.upper())
            query = query.where(ReviewRequest.status == status_enum)
        except ValueError:
            pass
    
    query = query.limit(limit).offset(offset)
    result = await db.execute(query)
    requests = result.scalars().all()
    
    return [
        ReviewRequestResponse(
            id=r.id,
            user_id=r.user_id,
            from_company=r.from_company,
            target_company=r.target_company,
            rating=r.rating,
            comment=r.comment,
            attachment_path=r.attachment_path,
            attachment_name=r.attachment_name,
            status=r.status.value,
            admin_comment=r.admin_comment,
            created_at=r.created_at,
            updated_at=r.updated_at
        )
        for r in requests
    ]


@router.get("/review-requests/{request_id}", response_model=ReviewRequestResponse)
async def get_review_request(request_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ReviewRequest).where(ReviewRequest.id == request_id))
    r = result.scalar()
    
    if not r:
        return {"error": "Request not found"}
    
    return ReviewRequestResponse(
        id=r.id,
        user_id=r.user_id,
        from_company=r.from_company,
        target_company=r.target_company,
        rating=r.rating,
        comment=r.comment,
        attachment_path=r.attachment_path,
        attachment_name=r.attachment_name,
        status=r.status.value,
        admin_comment=r.admin_comment,
        created_at=r.created_at,
        updated_at=r.updated_at
    )


@router.post("/review-requests/{request_id}/approve")
async def approve_review_request(
    request_id: int,
    admin_comment: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    service = ReviewRequestService(db)
    review = await service.approve_request(request_id, admin_comment)
    
    if not review:
        return {"error": "Request not found"}
    
    return {"message": "Отзыв одобрен и опубликован", "review_id": review.id}


@router.post("/review-requests/{request_id}/reject")
async def reject_review_request(
    request_id: int,
    admin_comment: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    service = ReviewRequestService(db)
    success = await service.reject_request(request_id, admin_comment)
    
    if not success:
        return {"error": "Request not found"}
    
    return {"message": "Заявка отклонена"}


@router.delete("/review-requests/{request_id}")
async def delete_review_request(request_id: int, db: AsyncSession = Depends(get_db)):
    service = ReviewRequestService(db)
    success = await service.delete_request(request_id)
    
    if not success:
        return {"error": "Request not found"}
    
    return {"message": "Заявка удалена"}
