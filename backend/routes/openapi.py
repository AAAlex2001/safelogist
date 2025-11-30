"""
Роуты для работы с OpenAPI компаний (разделены по странам)
"""
from fastapi import APIRouter, HTTPException, status, Path

from schemas.portugal import PortugalApiResponse, PtAdvanced
from schemas.france import FranceApiResponse, FrAdvanced
from schemas.poland import PolandApiResponse, PlAdvanced
from services.openapi_service import OpenAPIService

router = APIRouter(tags=["openapi"])


# ============================================================================
# Португалия
# ============================================================================

@router.get("/PT-advanced/{code}", response_model=PtAdvanced)
async def get_portugal_company(
    code: str = Path(..., description="VAT код, налоговый код или ID компании (например: PT500273170)")
):
    """
    Получить информацию о португальской компании по VAT коду, налоговому коду или ID
    
    - **code**: VAT код, налоговый код или ID компании (например: PT500273170)
    
    Returns:
        PtAdvanced: Расширенная информация о португальской компании
    """
    service = OpenAPIService()
    response = await service.get_company("PT", "advanced", code, PortugalApiResponse)
    
    if not response.success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=response.message or "Request failed"
        )
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    return response.data[0]


# ============================================================================
# Франция
# ============================================================================

@router.get("/FR-advanced/{code}", response_model=FrAdvanced)
async def get_france_company_advanced(
    code: str = Path(..., description="SIRET код, налоговый код или ID компании")
):
    """
    Получить информацию о французской компании по SIRET коду, налоговому коду или ID
    
    - **code**: SIRET код, налоговый код или ID компании
    
    Returns:
        FrAdvanced: Расширенная информация о французской компании
    """
    service = OpenAPIService()
    response = await service.get_company("FR", "advanced", code, FranceApiResponse)
    
    if not response.success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=response.message or "Request failed"
        )
    
    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    return response.data[0]

# ============================================================================
# Польша
# ============================================================================

@router.get("/PL-advanced/{code}", response_model=PlAdvanced)
async def get_poland_company_advanced(
    code: str = Path(..., description="NIP, REGON, KRS, VAT код или ID компании")
):
    """
    Получить информацию о польской компании по любому идентификатору:
    - **NIP** (налоговый номер)
    - **REGON** (реестр гос. экономики)
    - **KRS** (нац. судовой реестр)
    - **VAT** номер
    - **любой ID**, поддерживаемый OpenAPI

    Returns:
        PlAdvanced — расширенная информация о польской компании
    """
    service = OpenAPIService()
    response = await service.get_company("PL", "advanced", code, PolandApiResponse)

    if not response.success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=response.message or "Request failed",
        )

    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    return response.data[0]
