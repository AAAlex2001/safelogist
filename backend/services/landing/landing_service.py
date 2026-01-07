import json
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.landing import (
    LandingHero,
    LandingReviewCta,
    LandingFunctions,
    LandingSteps,
    LandingReviews,
    LandingBot,
    LandingTariffs,
    LandingFaq,
)
from schemas.landing import (
    HeroContentOut,
    HeroContentUpsert,
    ReviewCtaOut,
    ReviewCtaUpsert,
    FunctionsOut,
    FunctionsUpsert,
    FunctionsItemOut,
    StepsOut,
    StepsUpsert,
    StepItemOut,
    ReviewsOut,
    ReviewsUpsert,
    BotOut,
    BotUpsert,
    BotItemOut,
    TariffsOut,
    TariffsUpsert,
    TariffCardOut,
    FaqOut,
    FaqUpsert,
    FaqItemOut,
    LandingContentOut,
)


class LandingService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_hero(self, locale: str) -> Optional[HeroContentOut]:
        result = await self.db.execute(
            select(LandingHero).where(LandingHero.locale == locale)
        )
        hero = result.scalar_one_or_none()
        if not hero:
            return None
        return HeroContentOut.model_validate(hero)

    async def upsert_hero(self, locale: str, data: HeroContentUpsert) -> HeroContentOut:
        result = await self.db.execute(
            select(LandingHero).where(LandingHero.locale == locale)
        )
        hero = result.scalar_one_or_none()

        if hero is None:
            hero = LandingHero(locale=locale, **data.model_dump())
            self.db.add(hero)
        else:
            for key, value in data.model_dump().items():
                setattr(hero, key, value)

        await self.db.commit()
        await self.db.refresh(hero)
        return HeroContentOut.model_validate(hero)

    async def get_review_cta(self, locale: str) -> Optional[ReviewCtaOut]:
        result = await self.db.execute(
            select(LandingReviewCta).where(LandingReviewCta.locale == locale)
        )
        cta = result.scalar_one_or_none()
        if not cta:
            return None
        return ReviewCtaOut.model_validate(cta)

    async def upsert_review_cta(self, locale: str, data: ReviewCtaUpsert) -> ReviewCtaOut:
        result = await self.db.execute(
            select(LandingReviewCta).where(LandingReviewCta.locale == locale)
        )
        cta = result.scalar_one_or_none()

        if cta is None:
            cta = LandingReviewCta(locale=locale, **data.model_dump())
            self.db.add(cta)
        else:
            for key, value in data.model_dump().items():
                setattr(cta, key, value)

        await self.db.commit()
        await self.db.refresh(cta)
        return ReviewCtaOut.model_validate(cta)

    async def get_functions(self, locale: str) -> Optional[FunctionsOut]:
        result = await self.db.execute(
            select(LandingFunctions).where(LandingFunctions.locale == locale)
        )
        functions = result.scalar_one_or_none()
        if not functions:
            return None

        tab1_items = [
            FunctionsItemOut(title=functions.tab1_item1_title, text=functions.tab1_item1_text),
            FunctionsItemOut(title=functions.tab1_item2_title, text=functions.tab1_item2_text),
            FunctionsItemOut(title=functions.tab1_item3_title, text=functions.tab1_item3_text),
            FunctionsItemOut(title=functions.tab1_item4_title, text=functions.tab1_item4_text),
        ]
        tab2_items = [
            FunctionsItemOut(title=functions.tab2_item1_title, text=functions.tab2_item1_text),
            FunctionsItemOut(title=functions.tab2_item2_title, text=functions.tab2_item2_text),
            FunctionsItemOut(title=functions.tab2_item3_title, text=functions.tab2_item3_text),
            FunctionsItemOut(title=functions.tab2_item4_title, text=functions.tab2_item4_text),
        ]

        return FunctionsOut(
            locale=functions.locale,
            title=functions.title,
            subtitle=functions.subtitle,
            tab1_label=functions.tab1_label,
            tab2_label=functions.tab2_label,
            tab1_items=tab1_items,
            tab2_items=tab2_items,
        )

    async def upsert_functions(self, locale: str, data: FunctionsUpsert) -> FunctionsOut:
        result = await self.db.execute(
            select(LandingFunctions).where(LandingFunctions.locale == locale)
        )
        functions = result.scalar_one_or_none()

        if functions is None:
            functions = LandingFunctions(locale=locale, **data.model_dump())
            self.db.add(functions)
        else:
            for key, value in data.model_dump().items():
                setattr(functions, key, value)

        await self.db.commit()
        await self.db.refresh(functions)
        return await self.get_functions(locale)

    async def get_steps(self, locale: str) -> Optional[StepsOut]:
        result = await self.db.execute(
            select(LandingSteps).where(LandingSteps.locale == locale)
        )
        steps = result.scalar_one_or_none()
        if not steps:
            return None

        step_items = [
            StepItemOut(counter=steps.step1_counter, title=steps.step1_title, text=steps.step1_text),
            StepItemOut(counter=steps.step2_counter, title=steps.step2_title, text=steps.step2_text),
            StepItemOut(counter=steps.step3_counter, title=steps.step3_title, text=steps.step3_text),
        ]

        return StepsOut(
            locale=steps.locale,
            title=steps.title,
            subtitle=steps.subtitle,
            steps=step_items,
        )

    async def upsert_steps(self, locale: str, data: StepsUpsert) -> StepsOut:
        result = await self.db.execute(
            select(LandingSteps).where(LandingSteps.locale == locale)
        )
        steps = result.scalar_one_or_none()

        if steps is None:
            steps = LandingSteps(locale=locale, **data.model_dump())
            self.db.add(steps)
        else:
            for key, value in data.model_dump().items():
                setattr(steps, key, value)

        await self.db.commit()
        await self.db.refresh(steps)
        return await self.get_steps(locale)

    async def get_reviews(self, locale: str) -> Optional[ReviewsOut]:
        result = await self.db.execute(
            select(LandingReviews).where(LandingReviews.locale == locale)
        )
        reviews = result.scalar_one_or_none()
        if not reviews:
            return None
        return ReviewsOut.model_validate(reviews)

    async def upsert_reviews(self, locale: str, data: ReviewsUpsert) -> ReviewsOut:
        result = await self.db.execute(
            select(LandingReviews).where(LandingReviews.locale == locale)
        )
        reviews = result.scalar_one_or_none()

        if reviews is None:
            reviews = LandingReviews(locale=locale, **data.model_dump())
            self.db.add(reviews)
        else:
            for key, value in data.model_dump().items():
                setattr(reviews, key, value)

        await self.db.commit()
        await self.db.refresh(reviews)
        return ReviewsOut.model_validate(reviews)

    async def get_bot(self, locale: str) -> Optional[BotOut]:
        result = await self.db.execute(
            select(LandingBot).where(LandingBot.locale == locale)
        )
        bot = result.scalar_one_or_none()
        if not bot:
            return None

        items = [
            BotItemOut(title=bot.item1_title, text=bot.item1_text),
            BotItemOut(title=bot.item2_title, text=bot.item2_text),
            BotItemOut(title=bot.item3_title, text=bot.item3_text),
        ]

        return BotOut(
            locale=bot.locale,
            title=bot.title,
            subtitle_text=bot.subtitle_text,
            subtitle_link_text=bot.subtitle_link_text,
            subtitle_link_url=bot.subtitle_link_url,
            subtitle_after_link=bot.subtitle_after_link,
            items=items,
            bot_handle=bot.bot_handle,
            bot_url=bot.bot_url,
        )

    async def upsert_bot(self, locale: str, data: BotUpsert) -> BotOut:
        result = await self.db.execute(
            select(LandingBot).where(LandingBot.locale == locale)
        )
        bot = result.scalar_one_or_none()

        if bot is None:
            bot = LandingBot(locale=locale, **data.model_dump())
            self.db.add(bot)
        else:
            for key, value in data.model_dump().items():
                setattr(bot, key, value)

        await self.db.commit()
        await self.db.refresh(bot)
        return await self.get_bot(locale)

    async def get_tariffs(self, locale: str) -> Optional[TariffsOut]:
        result = await self.db.execute(
            select(LandingTariffs).where(LandingTariffs.locale == locale)
        )
        tariffs = result.scalar_one_or_none()
        if not tariffs:
            return None

        cards = [
            TariffCardOut(
                badge=tariffs.card1_badge,
                title=tariffs.card1_title,
                price=tariffs.card1_price,
                period=tariffs.card1_period,
                note=tariffs.card1_note,
                features=tariffs.card1_features.split("\n"),
                cta=tariffs.card1_cta,
                popular=False,
            ),
            TariffCardOut(
                badge=tariffs.card2_badge,
                title=tariffs.card2_title,
                price=tariffs.card2_price,
                period=tariffs.card2_period,
                note=tariffs.card2_note,
                features=tariffs.card2_features.split("\n"),
                cta=tariffs.card2_cta,
                popular=tariffs.card2_popular,
            ),
            TariffCardOut(
                badge=tariffs.card3_badge,
                title=tariffs.card3_title,
                price=tariffs.card3_price,
                period=tariffs.card3_period,
                note=tariffs.card3_note,
                features=tariffs.card3_features.split("\n"),
                cta=tariffs.card3_cta,
                popular=False,
            ),
        ]

        return TariffsOut(
            locale=tariffs.locale,
            title=tariffs.title,
            subtitle=tariffs.subtitle,
            cards=cards,
        )

    async def upsert_tariffs(self, locale: str, data: TariffsUpsert) -> TariffsOut:
        result = await self.db.execute(
            select(LandingTariffs).where(LandingTariffs.locale == locale)
        )
        tariffs = result.scalar_one_or_none()

        if tariffs is None:
            tariffs = LandingTariffs(locale=locale, **data.model_dump())
            self.db.add(tariffs)
        else:
            for key, value in data.model_dump().items():
                setattr(tariffs, key, value)

        await self.db.commit()
        await self.db.refresh(tariffs)
        return await self.get_tariffs(locale)

    async def get_faq(self, locale: str) -> Optional[FaqOut]:
        result = await self.db.execute(
            select(LandingFaq).where(LandingFaq.locale == locale)
        )
        faq = result.scalar_one_or_none()
        if not faq:
            return None

        try:
            items_data = json.loads(faq.items)
            items = [FaqItemOut(question=item["question"], answer=item["answer"]) for item in items_data]
        except (json.JSONDecodeError, KeyError):
            items = []

        return FaqOut(
            locale=faq.locale,
            title=faq.title,
            items=items,
        )

    async def upsert_faq(self, locale: str, data: FaqUpsert) -> FaqOut:
        result = await self.db.execute(
            select(LandingFaq).where(LandingFaq.locale == locale)
        )
        faq = result.scalar_one_or_none()

        if faq is None:
            faq = LandingFaq(locale=locale, title=data.title, items=data.items)
            self.db.add(faq)
        else:
            faq.title = data.title
            faq.items = data.items

        await self.db.commit()
        await self.db.refresh(faq)
        return await self.get_faq(locale)

    async def get_all_content(self, locale: str) -> LandingContentOut:
        hero = await self.get_hero(locale)
        review_cta = await self.get_review_cta(locale)
        functions = await self.get_functions(locale)
        steps = await self.get_steps(locale)
        reviews = await self.get_reviews(locale)
        bot = await self.get_bot(locale)
        tariffs = await self.get_tariffs(locale)
        faq = await self.get_faq(locale)

        return LandingContentOut(
            hero=hero,
            review_cta=review_cta,
            functions=functions,
            steps=steps,
            reviews=reviews,
            bot=bot,
            tariffs=tariffs,
            faq=faq,
        )
