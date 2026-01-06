"""
Публичный API для лендинга (для SSR Next.js)
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from services.landing.hero_service import HeroService
from schemas.landing import HeroContentOut

router = APIRouter(prefix="/api/landing", tags=["landing"])


@router.get("/hero", response_model=HeroContentOut)
async def get_hero(
    lang: str = Query("ru", min_length=2, max_length=10),
    db: AsyncSession = Depends(get_db),
):
    """Получить Hero контент для публичного отображения."""
    service = HeroService(db)
    hero = await service.get_by_locale(lang)
    
    if not hero:
        raise HTTPException(status_code=404, detail=f"Hero content for locale '{lang}' not found")
    
    return hero
