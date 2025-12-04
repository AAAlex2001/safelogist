from fastapi import APIRouter, HTTPException
from schemas.legat import (ByFullResponse,
                           ByCourtResponse,
                           ByActionalResponse,
                           ByBankruptResponse,
                           KzFullResponse,
                           KzDataResponse,
                           KzTaxResponse,
                           KzContactsResponse,
                           KzRiskResponse,
                           KzDebtResponse,
                           KzCourtResponse,
                           KzDirectorsLinksResponse,
                           UaFullResponse,
                           UaDataResponse,
                           UaCourtResponse,
                           UaBankruptResponse,
                           UaLiquidationResponse,
                           UaVehiclesResponse,
                           KgFullResponse,
                           KgDataResponse,
                           KgDebtResponse,
                           MdaFullResponse,
                           MdaDataResponse,
                           MdaDirectorsResponse,
                           MdaFoundersResponse,
                           MdaBeneficiariesResponse,
                           UzFullResponse,
                           UzDataResponse,
                           UzUnscrupulousResponse,
                           UzRiskResponse,
                           UzCourtResponse,
                           UzFoundersResponse,
                           UzContactsResponse,
                           UzAddressResponse)
from services.legat_service import LegatService
from services.legat_service import LEGAT_TOKEN

router = APIRouter(tags=["legat"])


# =======================================
#   Belarus
# =======================================

@router.get(
    "/BY/full/{unp}",
    response_model=ByFullResponse
)
async def get_by_full(unp: str):
    """
    Полная юридическая информация по компании из Legat API:
    - Судебные дела (взыскатель)
    - Судебные дела (истец/ответчик/третьи лица)
    - Банкротство
    """

    service = LegatService()

    court = await service.get(
        f"/api2/by/court?unp={unp}&key={LEGAT_TOKEN}",
        ByCourtResponse
    )

    actional = await service.get(
        f"/api2/by/actional?unp={unp}&key={LEGAT_TOKEN}",
        ByActionalResponse
    )

    bankrupt = await service.get(
        f"/api2/by/bankrupt?unp={unp}&key={LEGAT_TOKEN}",
        ByBankruptResponse
    )

    return ByFullResponse(
        court=court,
        actional=actional,
        bankrupt=bankrupt
    )


# =======================================
#   Kazakhstan
# =======================================

@router.get(
    "/KZ/full/{unp}",
    response_model=KzFullResponse
)
async def get_kz_full(unp: str):
    """
    Полная сводная юридическая информация по компании Казахстана из Legat API:
    - Регистрационные данные
    - Налоги по годам
    - Контакты компании
    - Риски (реестры неблагонадёжности)
    - Задолженности (налоговые, пенсионные, таможенные)
    - Судебные дела
    - Связи руководителей
    """

    service = LegatService()

    data = await service.get(
        f"/api2/kz/data?unp={unp}&key={LEGAT_TOKEN}",
        KzDataResponse
    )

    tax = await service.get(
        f"/api2/kz/tax?unp={unp}&key={LEGAT_TOKEN}",
        KzTaxResponse
    )

    contacts = await service.get(
        f"/api2/kz/contacts?unp={unp}&key={LEGAT_TOKEN}",
        KzContactsResponse
    )

    risk = await service.get(
        f"/api2/kz/risk?unp={unp}&key={LEGAT_TOKEN}",
        KzRiskResponse
    )

    debt = await service.get(
        f"/api2/kz/debt?unp={unp}&key={LEGAT_TOKEN}",
        KzDebtResponse
    )

    court = await service.get(
        f"/api2/kz/court?unp={unp}&key={LEGAT_TOKEN}",
        KzCourtResponse
    )

    directors = await service.get(
        f"/api2/kz/directorsLinks?unp={unp}&key={LEGAT_TOKEN}",
        KzDirectorsLinksResponse
    )

    return KzFullResponse(
        data=data,
        tax=tax,
        contacts=contacts,
        risk=risk,
        debt=debt,
        court=court,
        directors=directors
    )


# =======================================
#   Ukraine
# =======================================

@router.get("/UA/full/{unp}", response_model=UaFullResponse)
async def get_ua_full(unp: str):
    """
    Полная юридическая информация по украинской компании из Legat API:
    - Общие регистрационные данные (data)
    - Судебные дела по всем категориям (court)
    - Банкротство (bankrupt)
    - Сведения о ликвидации (liquidation)
    - Лицензированные транспортные средства (vehicles)
    """

    service = LegatService()

    data = await service.get(
        f"/api2/ua/data?unp={unp}&key={LEGAT_TOKEN}",
        UaDataResponse
    )

    court = await service.get(
        f"/api2/ua/court?unp={unp}&key={LEGAT_TOKEN}",
        UaCourtResponse
    )

    bankrupt = await service.get(
        f"/api2/ua/bankrupt?unp={unp}&key={LEGAT_TOKEN}",
        UaBankruptResponse
    )

    liquidation = await service.get(
        f"/api2/ua/liquidation?unp={unp}&key={LEGAT_TOKEN}",
        UaLiquidationResponse
    )

    vehicles = await service.get(
        f"/api2/ua/vehicles?unp={unp}&key={LEGAT_TOKEN}",
        UaVehiclesResponse
    )

    return UaFullResponse(
        data=data,
        court=court,
        bankrupt=bankrupt,
        liquidation=liquidation,
        vehicles=vehicles,
    )


# =======================================
#   Kyrgyzstan
# =======================================

@router.get(
    "/KG/full/{unp}",
    response_model=KgFullResponse
)
async def get_kg_full(unp: str):
    """
    Полная юридическая информация по компании из Legat API (Кыргызстан):
    - Общие регистрационные сведения (data)
    - Задолженности по датам (debt)
    """

    service = LegatService()

    data = await service.get(
        f"/api2/kg/data?unp={unp}&key={LEGAT_TOKEN}",
        KgDataResponse
    )

    debt = await service.get(
        f"/api2/kg/debt?unp={unp}&key={LEGAT_TOKEN}",
        KgDebtResponse
    )

    return KgFullResponse(
        data=data,
        debt=debt
    )


# =======================================
#   Moldova
# =======================================

@router.get(
    "/MDA/full/{unp}",
    response_model=MdaFullResponse
)
async def get_mda_full(unp: str):
    """
    Полная юридическая информация по молдавской компании из Legat API:
    - Общие регистрационные данные (data)
    - Руководители (directors)
    - Учредители (founders)
    - Бенефициары (beneficiaries)
    """

    service = LegatService()

    data = await service.get(
        f"/api2/mda/data?unp={unp}&key={LEGAT_TOKEN}",
        MdaDataResponse
    )

    directors = await service.get(
        f"/api2/mda/directors?unp={unp}&key={LEGAT_TOKEN}",
        MdaDirectorsResponse
    )

    founders = await service.get(
        f"/api2/mda/founders?unp={unp}&key={LEGAT_TOKEN}",
        MdaFoundersResponse
    )

    beneficiaries = await service.get(
        f"/api2/mda/beneficiaries?unp={unp}&key={LEGAT_TOKEN}",
        MdaBeneficiariesResponse
    )

    return MdaFullResponse(
        data=data,
        directors=directors,
        founders=founders,
        beneficiaries=beneficiaries
    )


# =======================================
#   Uzbekistan
# =======================================

@router.get(
    "/UZ/full/{unp}",
    response_model=UzFullResponse
)
async def get_uz_full(unp: str):
    """
    Полная юридическая информация по компании из Legat API (Узбекистан):
    - Основные регистрационные данные (data)
    - Недобросовестные участники (unscrupulous)
    - Риски (risk)
    - Судебные дела (court)
    - История и актуальные учредители (founders)
    - Контакты (contacts)
    - Адреса (address)
    """

    service = LegatService()

    data = await service.get(
        f"/api2/uz/data?unp={unp}&key={LEGAT_TOKEN}",
        UzDataResponse
    )

    unscrupulous = await service.get(
        f"/api2/uz/unscrupulous?unp={unp}&key={LEGAT_TOKEN}",
        UzUnscrupulousResponse
    )

    risk = await service.get(
        f"/api2/uz/risk?unp={unp}&key={LEGAT_TOKEN}",
        UzRiskResponse
    )

    court = await service.get(
        f"/api2/uz/court?unp={unp}&key={LEGAT_TOKEN}",
        UzCourtResponse
    )

    founders = await service.get(
        f"/api2/uz/founders?unp={unp}&key={LEGAT_TOKEN}",
        UzFoundersResponse
    )

    contacts = await service.get(
        f"/api2/uz/contacts?unp={unp}&key={LEGAT_TOKEN}",
        UzContactsResponse
    )

    address = await service.get(
        f"/api2/uz/address?unp={unp}&key={LEGAT_TOKEN}",
        UzAddressResponse
    )

    return UzFullResponse(
        data=data,
        unscrupulous=unscrupulous,
        risk=risk,
        court=court,
        founders=founders,
        contacts=contacts,
        address=address
    )
