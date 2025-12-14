"""
Роуты для заявок на подтверждение компании
"""
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models.company_claim import CompanyClaim, ClaimStatus
from schemas.company_claim import (
    CompanyClaimRequest, 
    CompanyClaimResponse, 
    ClaimListItem, 
    ClaimReview
)
from services.company_claim_service import CompanyClaimService


router = APIRouter(prefix="/api/company-claim", tags=["company_claim"])


@router.post("", response_model=CompanyClaimResponse, status_code=status.HTTP_201_CREATED)
async def create_company_claim(
    last_name: str = Form(..., description="Фамилия"),
    first_name: str = Form(..., description="Имя"),
    middle_name: str | None = Form(None, description="Отчество"),
    phone: str = Form(..., description="Номер телефона"),
    company_name: str = Form(..., description="Название компании"),
    position: str = Form(..., description="Должность"),
    email: str = Form(..., description="Электронная почта"),
    document: UploadFile = File(..., description="Подтверждающий документ"),
    db: AsyncSession = Depends(get_db)
):
    """
    Создание заявки на подтверждение компании
    
    Принимает данные формы (3 шага) и загруженный документ.
    Заявка будет рассмотрена в течение 48 часов.
    """
    try:
        claim_data = CompanyClaimRequest(
            last_name=last_name,
            first_name=first_name,
            middle_name=middle_name,
            phone=phone,
            company_name=company_name,
            position=position,
            email=email
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ошибка валидации данных: {str(e)}"
        )

    service = CompanyClaimService(db)
    
    try:
        claim = await service.create_claim(claim_data, document)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при создании заявки: {str(e)}"
        )
    
    return CompanyClaimResponse(
        id=claim.id,
        company_name=claim.company_name,
        status=claim.status.value,
        created_at=claim.created_at
    )


@router.get("", response_model=List[ClaimListItem])
async def list_claims(
    claim_status: Optional[str] = Query(None, alias="status", description="Фильтр по статусу: PENDING, APPROVED, REJECTED"),
    db: AsyncSession = Depends(get_db)
):
    """
    Получить список всех заявок (для админки)
    """
    query = select(CompanyClaim).order_by(CompanyClaim.created_at.desc())
    
    if claim_status:
        # Преобразуем строку в enum
        try:
            status_enum = ClaimStatus(claim_status.upper())
            query = query.where(CompanyClaim.status == status_enum)
        except ValueError:
            pass  # Игнорируем неверный статус
    
    result = await db.execute(query)
    claims = result.scalars().all()
    return list(claims) if claims else []


@router.get("/{claim_id}", response_model=ClaimListItem)
async def get_claim(
    claim_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Получить заявку по ID
    """
    result = await db.execute(
        select(CompanyClaim).where(CompanyClaim.id == claim_id)
    )
    claim = result.scalar()
    
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заявка не найдена"
        )
    
    return claim


@router.patch("/{claim_id}", response_model=ClaimListItem)
async def review_claim(
    claim_id: int,
    review: ClaimReview,
    db: AsyncSession = Depends(get_db)
):
    """
    Рассмотреть заявку (одобрить/отклонить)
    """
    result = await db.execute(
        select(CompanyClaim).where(CompanyClaim.id == claim_id)
    )
    claim = result.scalar()
    
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заявка не найдена"
        )
    
    claim.status = review.status
    claim.admin_comment = review.admin_comment
    claim.updated_at = datetime.now(timezone.utc)
    
    await db.commit()
    await db.refresh(claim)
    
    return claim

