"""
API для заявок на владение компанией
"""
import os
import uuid
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models.user import User
from models.company_claim import CompanyClaim, ClaimStatus
from schemas.company_claim import ClaimResponse, ClaimReview

router = APIRouter(prefix="/api/claims", tags=["company_claims"])

UPLOAD_DIR = "uploads/claims"


async def get_current_user(user_id: int, db: AsyncSession) -> User:
    """Получить пользователя (упрощённая версия)"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("", response_model=ClaimResponse)
async def create_claim(
    user_id: int = Form(...),
    company_name: str = Form(...),
    last_name: str = Form(...),
    first_name: str = Form(...),
    middle_name: str = Form(None),
    phone: str = Form(...),
    email: str = Form(...),
    position: str = Form(...),
    document: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """Создать заявку на владение компанией"""
    # Проверяем пользователя
    await get_current_user(user_id, db)

    # Проверяем формат файла
    allowed_types = ["application/pdf", "image/jpeg", "image/png"]
    if document.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type")

    # Сохраняем файл
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    ext = document.filename.split(".")[-1] if document.filename else "pdf"
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        content = await document.read()
        f.write(content)

    # Создаём заявку
    claim = CompanyClaim(
        user_id=user_id,
        company_name=company_name,
        last_name=last_name,
        first_name=first_name,
        middle_name=middle_name,
        phone=phone,
        email=email,
        position=position,
        document_path=filepath
    )

    db.add(claim)
    await db.commit()
    await db.refresh(claim)

    return claim


@router.get("", response_model=List[ClaimResponse])
async def list_claims(
    status: ClaimStatus = None,
    db: AsyncSession = Depends(get_db)
):
    """Список заявок (для админки)"""
    query = select(CompanyClaim).order_by(CompanyClaim.created_at.desc())
    if status:
        query = query.where(CompanyClaim.status == status)

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{claim_id}", response_model=ClaimResponse)
async def get_claim(claim_id: int, db: AsyncSession = Depends(get_db)):
    """Получить заявку по ID"""
    result = await db.execute(select(CompanyClaim).where(CompanyClaim.id == claim_id))
    claim = result.scalar()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim


@router.patch("/{claim_id}", response_model=ClaimResponse)
async def review_claim(
    claim_id: int,
    review: ClaimReview,
    db: AsyncSession = Depends(get_db)
):
    """Рассмотреть заявку (одобрить/отклонить)"""
    result = await db.execute(select(CompanyClaim).where(CompanyClaim.id == claim_id))
    claim = result.scalar()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    claim.status = review.status
    claim.reject_reason = review.reject_reason
    claim.reviewed_at = datetime.now(timezone.utc)

    # Если одобрено - привязываем компанию к пользователю
    if review.status == ClaimStatus.APPROVED:
        user_result = await db.execute(select(User).where(User.id == claim.user_id))
        user = user_result.scalar()
        if user:
            user.company_name = claim.company_name

    await db.commit()
    await db.refresh(claim)

    return claim
