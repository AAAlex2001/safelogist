from fastapi import APIRouter, HTTPException, status, Path
from schemas.ofdata.ofdata_company import OfdataCompanyResponse
from schemas.ofdata.ofdata_entrepreneur import OfdataEntrepreneurResponse
from schemas.ofdata.ofdata_full import OfdataFullResponse
from services.offdata_service import OffdataService

router = APIRouter(tags=["offdata"])


@router.get(
    "/RU/full/{inn}",
    response_model=OfdataFullResponse
)
async def get_ru_full_by_inn(
    inn: str = Path(..., description="ИНН компании (10 цифр) или ИП (12 цифр)")
):
    """
    Получить полную юридическую информацию о российской компании и/или предпринимателе по ИНН.
    
    Параметры:
    - **inn**: ИНН компании (10 цифр) или ИП (12 цифр)
    
    Returns:
        OfdataFullResponse: Полная информация о компании и/или предпринимателе
    """
    service = OffdataService()
    
    company_response = None
    entrepreneur_response = None
    
    # Пытаемся получить данные компании по ИНН
    try:
        company_response = await service.get(
            endpoint="company",
            response_model=OfdataCompanyResponse,
            inn=inn
        )
        if not company_response or not company_response.data or not company_response.data.ogrn:
            company_response = None
    except Exception:
        company_response = None
    
    # Пытаемся получить данные предпринимателя по ИНН
    try:
        entrepreneur_response = await service.get(
            endpoint="entrepreneur",
            response_model=OfdataEntrepreneurResponse,
            inn=inn
        )
        if not entrepreneur_response or not entrepreneur_response.data or not entrepreneur_response.data.ogrnip:
            entrepreneur_response = None
    except Exception:
        entrepreneur_response = None

    if not company_response and not entrepreneur_response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Не найдено ни компании, ни предпринимателя по указанному ИНН"
        )
    
    return OfdataFullResponse(
        company=company_response,
        entrepreneur=entrepreneur_response
    )
