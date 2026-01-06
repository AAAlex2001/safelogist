"""
Сервис для работы с Hero секцией лендинга
"""
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.landing import LandingHero
from schemas.landing import HeroContentUpsert


class HeroService:
    """Сервис для управления Hero контентом"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_locale(self, locale: str) -> Optional[LandingHero]:
        """Получить Hero контент по локали"""
        result = await self.db.execute(
            select(LandingHero).where(LandingHero.locale == locale)
        )
        return result.scalar_one_or_none()

    async def upsert(self, locale: str, data: HeroContentUpsert) -> LandingHero:
        """Создать или обновить Hero контент"""
        hero = await self.get_by_locale(locale)

        if hero is None:
            hero = LandingHero(locale=locale, **data.model_dump())
            self.db.add(hero)
        else:
            for key, value in data.model_dump().items():
                setattr(hero, key, value)

        await self.db.commit()
        await self.db.refresh(hero)
        return hero
