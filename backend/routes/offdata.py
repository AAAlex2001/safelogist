from fastapi import APIRouter, HTTPException, status, Path
from schemas.ofdata.ofdata_company import OfdataCompanyResponse
from schemas.ofdata.ofdata_entrepreneur import OfdataEntrepreneurResponse
from schemas.ofdata.ofdata_full import OfdataFullResponse
from schemas.ofdata.ofdata_person import OfdataPersonResponse
from schemas.ofdata.ofdata_inspections import OfdataInspectionsResponse
from schemas.ofdata.ofdata_enforcements import OfdataEnforcementsResponse
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
    Получить полную юридическую информацию о российской компании, предпринимателе,
    физическом лице, проверках и исполнительных производствах по ИНН.

    Параметры:
    - **inn**: ИНН компании (10 цифр) или ИП/физлица (12 цифр)

    Returns:
        OfdataFullResponse: Полная информация по всем доступным источникам Offdata
    """
    service = OffdataService()

    company_response = None
    entrepreneur_response = None
    person_response = None
    inspections_response = None
    enforcements_response = None

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

    # Пытаемся получить данные физического лица по ИНН
    try:
        person_response = await service.get(
            endpoint="person",
            response_model=OfdataPersonResponse,
            inn=inn
        )
        if not person_response or not person_response.data or not person_response.data.inn:
            person_response = None
    except Exception:
        person_response = None

    # Пытаемся получить данные о проверках
    try:
        inspections_response = await service.get(
            endpoint="inspections",
            response_model=OfdataInspectionsResponse,
            inn=inn
        )
        # Если в data нет записей — считаем, что данных нет
        if not inspections_response or not inspections_response.data or not inspections_response.data.zapisi:
            inspections_response = None
    except Exception:
        inspections_response = None

    # Пытаемся получить данные об исполнительных производствах
    try:
        enforcements_response = await service.get(
            endpoint="enforcements",
            response_model=OfdataEnforcementsResponse,
            inn=inn
        )
        if not enforcements_response or not enforcements_response.data or not enforcements_response.data.zapisi:
            enforcements_response = None
    except Exception:
        enforcements_response = None

    if (
        not company_response
        and not entrepreneur_response
        and not person_response
        and not inspections_response
        and not enforcements_response
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "Не найдено ни компании, ни предпринимателя, ни физлица, "
                "ни проверок, ни исполнительных производств по указанному ИНН"
            ),
        )

    return OfdataFullResponse(
        company=company_response,
        entrepreneur=entrepreneur_response,
        person=person_response,
        inspections=inspections_response,
        enforcements=enforcements_response,
    )
