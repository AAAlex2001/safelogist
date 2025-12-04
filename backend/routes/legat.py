from fastapi import APIRouter, HTTPException
from schemas.legat import ByCourtResponse, ByActionalResponse, ByBankruptResponse, ByFullResponse
from services.legat_service import LegatService
from services.legat_service import LEGAT_TOKEN

router = APIRouter(tags=["legat"])


@router.get("/BY/full/{unp}", response_model=ByFullResponse)
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
