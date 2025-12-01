"""
Роуты для работы с OpenAPI компаний (разделены по странам)
"""
from fastapi import APIRouter, HTTPException, status, Path
from schemas.world import WorldApiResponse, WorldCompany
from services.openapi_service import OpenAPIService

router = APIRouter(tags=["openapi"])


# ============================================================================
# Мир (World / WW)
# ============================================================================

@router.get("/WW-advanced/{code}", response_model=WorldCompany)
async def get_world_company_advanced(
    code: str = Path(
        ...,
        description=(
            "Идентификатор компании (VAT, taxCode, companyNumber и т.п.), "
            "по которому выполняется глобальный поиск (Italy/FR/DE/ES/PT/GB/BE/AT/CH/PL/WW)"
        ),
    )
):
    """
    Глобальный поиск компании по любому коду (VAT, taxCode, companyNumber и т.д.)
    среди стран и глобального реестра (WW).

    Возвращает первую найденную компанию соответствующего типа:
    - ItAdvanced
    - FrAdvanced
    - DeAdvanced
    - EsAdvanced
    - PtAdvanced
    - GbAdvanced
    - BeAdvanced
    - AtAdvanced
    - ChAdvanced
    - PlAdvanced
    - WwAdvanced
    """
    service = OpenAPIService()
    response = await service.get_company("WW", "advanced", code, WorldApiResponse)

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

    # Берём первую найденную; тип будет один из WorldCompany (Union[…])
    return response.data[0]





