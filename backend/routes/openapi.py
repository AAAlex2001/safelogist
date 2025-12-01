"""
Роуты для работы с OpenAPI компаний (разделены по странам)
"""
from fastapi import APIRouter, HTTPException, status, Path
from schemas.world import WwTopApiResponse, WwTop
from services.openapi_service import OpenAPIService

router = APIRouter(tags=["openapi"])


# ============================================================================
# Мир (World / WW)
# ============================================================================

@router.get("/WW-top/{country}/{code}", response_model=WwTop)
async def get_world_top_company(
        country: str = Path(..., description="ISO2 код страны (IT, FR, DE, ES, PT, GB, BE, AT, CH, PL, ...)"),
        code: str = Path(..., description="VAT, taxCode, companyNumber или ID компании")
):
    """
    Получить расширенную Top-информацию компании через Worldwide Top endpoint.

    API endpoint:
        /WW-top/{country}/{code}
    """
    service = OpenAPIService()

    response = await service.get_company(
        "WW",
        f"top/{country}",
        code,
        WwTopApiResponse
    )

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






