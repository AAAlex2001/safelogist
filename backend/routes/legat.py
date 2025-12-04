from fastapi import APIRouter, HTTPException
from schemas.legat import (ByCourtResponse,
                           ByActionalResponse,
                           ByBankruptResponse,
                           ByFullResponse,
                           KzFullResponse,
                           KzDataResponse,
                           KzTaxResponse,
                           KzContactsResponse,
                           KzRiskResponse,
                           KzDebtResponse,
                           KzCourtResponse,
                           KzDirectorsLinksResponse)
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
    "/KZ/full/{bin}",
    response_model=KzFullResponse
)
async def get_kz_full(bin: str):
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
        f"/api2/kz/data?unp={bin}&key={LEGAT_TOKEN}",
        KzDataResponse
    )

    tax = await service.get(
        f"/api2/kz/tax?unp={bin}&key={LEGAT_TOKEN}",
        KzTaxResponse
    )

    contacts = await service.get(
        f"/api2/kz/contacts?unp={bin}&key={LEGAT_TOKEN}",
        KzContactsResponse
    )

    risk = await service.get(
        f"/api2/kz/risk?unp={bin}&key={LEGAT_TOKEN}",
        KzRiskResponse
    )

    debt = await service.get(
        f"/api2/kz/debt?unp={bin}&key={LEGAT_TOKEN}",
        KzDebtResponse
    )

    court = await service.get(
        f"/api2/kz/court?unp={bin}&key={LEGAT_TOKEN}",
        KzCourtResponse
    )

    directors = await service.get(
        f"/api2/kz/directorsLinks?unp={bin}&key={LEGAT_TOKEN}",
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

