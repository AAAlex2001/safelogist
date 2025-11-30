"""
Роуты для работы с API португальских компаний
"""
from fastapi import APIRouter, HTTPException, status

from schemas.portugal import PortugalApiResponse, PtAdvanced
from services.portugal import PortugalService

router = APIRouter(prefix="/PT-advanced", tags=["portugal"])


@router.get("/{vat_code_tax_code_or_id}", response_model=PtAdvanced)
async def get_portugal_company(
    vat_code_tax_code_or_id: str
):
    """
    Получить информацию о португальской компании по VAT коду, налоговому коду или ID
    
    - **vat_code_tax_code_or_id**: VAT код, налоговый код или ID компании (например: PT500273170)
    
    Returns:
        PtAdvanced: Расширенная информация о компании
    """
    service = PortugalService()
    response = await service.get_company_by_code(vat_code_tax_code_or_id)
    
    # Проверяем успешность ответа
    if not response.success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=response.message or "Request failed"
        )
    
    # Проверяем наличие данных
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    # Возвращаем первую компанию из списка
    return response.data[0]

