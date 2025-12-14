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

    return StatsResponse(
        total_users=total_users.scalar() or 0,
        active_users=active_users.scalar() or 0,
        pending_claims=pending_claims.scalar() or 0,
        approved_claims=approved_claims.scalar() or 0
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
