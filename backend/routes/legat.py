from typing import Union
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
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
                           UzAddressResponse,
                           AmFullResponse,
                           AmDataResponse,
                           AmAddressResponse,
                           AmNamesResponse)
from services.legat_service import LegatService
from services.legat_service import LEGAT_TOKEN
from services.financial_reports import FinancialReportsService

router = APIRouter(tags=["legat"])


# =======================================
#   Универсальный эндпоинт для всех стран
# =======================================

@router.get(
    "/full/{country}/{unp}",
    response_model=Union[
        ByFullResponse,
        KzFullResponse,
        UaFullResponse,
        KgFullResponse,
        MdaFullResponse,
        UzFullResponse,
        AmFullResponse
    ]
)
async def get_full(country: str, unp: str, db: AsyncSession = Depends(get_db)):
    """
    Универсальный эндпоинт для получения полной юридической информации по компании из Legat API.
    
    Поддерживаемые страны:
    - BY (Беларусь)
    - KZ (Казахстан)
    - UA (Украина)
    - KG (Кыргызстан)
    - MDA (Молдова)
    - UZ (Узбекистан)
    - AM (Армения)
    """
    country = country.upper()
    service = LegatService()
    
    if country == "BY":
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
    
    elif country == "KZ":
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
    
    elif country == "UA":
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
    
    elif country == "KG":
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
    
    elif country == "MDA":
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
        
        # Получаем финансовые отчеты из нашей БД
        fin_service = FinancialReportsService(db)
        financial_reports = await fin_service.get_reports_by_fiscal_code(unp)
        
        return MdaFullResponse(
            data=data,
            directors=directors,
            founders=founders,
            beneficiaries=beneficiaries,
            financial_reports=financial_reports.dict() if financial_reports.total > 0 else None
        )
    
    elif country == "UZ":
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
    
    elif country == "AM":
        data = await service.get(
            f"/api2/am/data?unp={unp}&key={LEGAT_TOKEN}",
            AmDataResponse
        )
        address = await service.get(
            f"/api2/am/address?unp={unp}&key={LEGAT_TOKEN}",
            AmAddressResponse
        )
        names = await service.get(
            f"/api2/am/names?unp={unp}&key={LEGAT_TOKEN}",
            AmNamesResponse
        )
        return AmFullResponse(
            data=data,
            address=address,
            names=names
        )
    
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Неподдерживаемая страна: {country}. Поддерживаются: BY, KZ, UA, KG, MDA, UZ, AM"
        )


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
async def get_mda_full(unp: str, db: AsyncSession = Depends(get_db)):
    """
    Полная юридическая информация по молдавской компании из Legat API:
    - Общие регистрационные данные (data)
    - Руководители (directors)
    - Учредители (founders)
    - Бенефициары (beneficiaries)
    - Финансовые отчеты (financial_reports) - из нашей БД
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

    # Получаем финансовые отчеты из нашей БД
    fin_service = FinancialReportsService(db)
    financial_reports = await fin_service.get_reports_by_fiscal_code(unp)

    return MdaFullResponse(
        data=data,
        directors=directors,
        founders=founders,
        beneficiaries=beneficiaries,
        financial_reports=financial_reports.dict() if financial_reports.total > 0 else None
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


# =======================================
#   Armenia
# =======================================

@router.get(
    "/AM/full/{unp}",
    response_model=AmFullResponse
)
async def get_am_full(unp: str):
    """
    Полная юридическая информация по компании из Legat API (Армения):
    - Основные регистрационные данные
    - Юридические адреса
    - История наименований
    """

    service = LegatService()

    data = await service.get(
        f"/api2/am/data?unp={unp}&key={LEGAT_TOKEN}",
        AmDataResponse
    )

    address = await service.get(
        f"/api2/am/address?unp={unp}&key={LEGAT_TOKEN}",
        AmAddressResponse
    )

    names = await service.get(
        f"/api2/am/names?unp={unp}&key={LEGAT_TOKEN}",
        AmNamesResponse
    )

    return AmFullResponse(
        data=data,
        address=address,
        names=names
    )
