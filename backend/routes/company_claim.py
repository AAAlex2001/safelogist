"""
Роуты для заявок на подтверждение компании
"""
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.company_claim import CompanyClaimRequest, CompanyClaimResponse
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

