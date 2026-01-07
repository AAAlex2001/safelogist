from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from services.landing import LandingService
from schemas.landing import (
    HeroContentOut,
    ReviewCtaOut,
    FunctionsOut,
    StepsOut,
    ReviewsOut,
    BotOut,
    TariffsOut,
    FaqOut,
    LandingContentOut,
)

router = APIRouter(prefix="/api/landing", tags=["landing"])


@router.get("/all", response_model=LandingContentOut)
async def get_all_content(
    lang: str = Query("ru", min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    return await service.get_all_content(lang)


@router.get("/hero", response_model=HeroContentOut)
async def get_hero(
    lang: str = Query("ru", min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    hero = await service.get_hero(lang)
    if not hero:
        raise HTTPException(status_code=404, detail=f"Hero content for locale '{lang}' not found")
    return hero


@router.get("/review-cta", response_model=ReviewCtaOut)
async def get_review_cta(
    lang: str = Query("ru", min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    cta = await service.get_review_cta(lang)
    if not cta:
        raise HTTPException(status_code=404, detail=f"ReviewCta content for locale '{lang}' not found")
    return cta


@router.get("/functions", response_model=FunctionsOut)
async def get_functions(
    lang: str = Query("ru", min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    functions = await service.get_functions(lang)
    if not functions:
        raise HTTPException(status_code=404, detail=f"Functions content for locale '{lang}' not found")
    return functions


@router.get("/steps", response_model=StepsOut)
async def get_steps(
    lang: str = Query("ru", min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    steps = await service.get_steps(lang)
    if not steps:
        raise HTTPException(status_code=404, detail=f"Steps content for locale '{lang}' not found")
    return steps


@router.get("/reviews", response_model=ReviewsOut)
async def get_reviews(
    lang: str = Query("ru", min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    reviews = await service.get_reviews(lang)
    if not reviews:
        raise HTTPException(status_code=404, detail=f"Reviews content for locale '{lang}' not found")
    return reviews


@router.get("/bot", response_model=BotOut)
async def get_bot(
    lang: str = Query("ru", min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    bot = await service.get_bot(lang)
    if not bot:
        raise HTTPException(status_code=404, detail=f"Bot content for locale '{lang}' not found")
    return bot


@router.get("/tariffs", response_model=TariffsOut)
async def get_tariffs(
    lang: str = Query("ru", min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    tariffs = await service.get_tariffs(lang)
    if not tariffs:
        raise HTTPException(status_code=404, detail=f"Tariffs content for locale '{lang}' not found")
    return tariffs


@router.get("/faq", response_model=FaqOut)
async def get_faq(
    lang: str = Query("ru", min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    service = LandingService(db)
    faq = await service.get_faq(lang)
    if not faq:
        raise HTTPException(status_code=404, detail=f"FAQ content for locale '{lang}' not found")
    return faq
