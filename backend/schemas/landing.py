from typing import Optional, List
from pydantic import BaseModel, Field


class HeroContentOut(BaseModel):
    locale: str
    title: str
    title_highlight: Optional[str] = None
    subtitle: str
    stat_companies_label: str
    stat_companies_value: int
    stat_companies_suffix: Optional[str] = None
    stat_reviews_label: str
    stat_reviews_value: int
    stat_reviews_suffix: Optional[str] = None
    stat_countries_label: str
    stat_countries_value: int
    stat_countries_suffix: Optional[str] = None
    stat_sources_label: str
    stat_sources_value: int
    stat_sources_suffix: Optional[str] = None

    class Config:
        from_attributes = True


class HeroContentUpsert(BaseModel):
    title: str = Field(..., min_length=1)
    title_highlight: Optional[str] = None
    subtitle: str = Field(..., min_length=1)
    stat_companies_label: str = Field(..., min_length=1)
    stat_companies_value: int = Field(..., ge=0)
    stat_companies_suffix: Optional[str] = None
    stat_reviews_label: str = Field(..., min_length=1)
    stat_reviews_value: int = Field(..., ge=0)
    stat_reviews_suffix: Optional[str] = None
    stat_countries_label: str = Field(..., min_length=1)
    stat_countries_value: int = Field(..., ge=0)
    stat_countries_suffix: Optional[str] = None
    stat_sources_label: str = Field(..., min_length=1)
    stat_sources_value: int = Field(..., ge=0)
    stat_sources_suffix: Optional[str] = None


class ReviewCtaOut(BaseModel):
    locale: str
    text: str
    highlight: Optional[str] = None
    link_url: str

    class Config:
        from_attributes = True


class ReviewCtaUpsert(BaseModel):
    text: str = Field(..., min_length=1)
    highlight: Optional[str] = None
    link_url: str = Field(..., min_length=1)


class FunctionsItemOut(BaseModel):
    title: str
    text: str


class FunctionsOut(BaseModel):
    locale: str
    title: str
    subtitle: str
    tab1_label: str
    tab2_label: str
    tab1_items: List[FunctionsItemOut]
    tab2_items: List[FunctionsItemOut]

    class Config:
        from_attributes = True


class FunctionsUpsert(BaseModel):
    title: str = Field(..., min_length=1)
    subtitle: str = Field(..., min_length=1)
    tab1_label: str = Field(..., min_length=1)
    tab2_label: str = Field(..., min_length=1)
    tab1_item1_title: str = Field(..., min_length=1)
    tab1_item1_text: str = Field(..., min_length=1)
    tab1_item2_title: str = Field(..., min_length=1)
    tab1_item2_text: str = Field(..., min_length=1)
    tab1_item3_title: str = Field(..., min_length=1)
    tab1_item3_text: str = Field(..., min_length=1)
    tab1_item4_title: str = Field(..., min_length=1)
    tab1_item4_text: str = Field(..., min_length=1)
    tab2_item1_title: str = Field(..., min_length=1)
    tab2_item1_text: str = Field(..., min_length=1)
    tab2_item2_title: str = Field(..., min_length=1)
    tab2_item2_text: str = Field(..., min_length=1)
    tab2_item3_title: str = Field(..., min_length=1)
    tab2_item3_text: str = Field(..., min_length=1)
    tab2_item4_title: str = Field(..., min_length=1)
    tab2_item4_text: str = Field(..., min_length=1)


class StepItemOut(BaseModel):
    counter: str
    title: str
    text: str


class StepsOut(BaseModel):
    locale: str
    title: str
    subtitle: str
    steps: List[StepItemOut]

    class Config:
        from_attributes = True


class StepsUpsert(BaseModel):
    title: str = Field(..., min_length=1)
    subtitle: str = Field(..., min_length=1)
    step1_counter: str = Field(..., min_length=1)
    step1_title: str = Field(..., min_length=1)
    step1_text: str = Field(..., min_length=1)
    step2_counter: str = Field(..., min_length=1)
    step2_title: str = Field(..., min_length=1)
    step2_text: str = Field(..., min_length=1)
    step3_counter: str = Field(..., min_length=1)
    step3_title: str = Field(..., min_length=1)
    step3_text: str = Field(..., min_length=1)


class ReviewsOut(BaseModel):
    locale: str
    title: str
    subtitle: str

    class Config:
        from_attributes = True


class ReviewsUpsert(BaseModel):
    title: str = Field(..., min_length=1)
    subtitle: str = Field(..., min_length=1)


class BotItemOut(BaseModel):
    title: str
    text: str


class BotOut(BaseModel):
    locale: str
    title: str
    subtitle_text: str
    subtitle_link_text: str
    subtitle_link_url: str
    subtitle_after_link: Optional[str] = None
    items: List[BotItemOut]
    bot_handle: str
    bot_url: str

    class Config:
        from_attributes = True


class BotUpsert(BaseModel):
    title: str = Field(..., min_length=1)
    subtitle_text: str = Field(..., min_length=1)
    subtitle_link_text: str = Field(..., min_length=1)
    subtitle_link_url: str = Field(..., min_length=1)
    subtitle_after_link: Optional[str] = None
    item1_title: str = Field(..., min_length=1)
    item1_text: str = Field(..., min_length=1)
    item2_title: str = Field(..., min_length=1)
    item2_text: str = Field(..., min_length=1)
    item3_title: str = Field(..., min_length=1)
    item3_text: str = Field(..., min_length=1)
    bot_handle: str = Field(..., min_length=1)
    bot_url: str = Field(..., min_length=1)


class TariffCardOut(BaseModel):
    badge: str
    title: str
    price: str
    period: str
    note: str
    features: List[str]
    cta: str
    popular: bool = False


class TariffsOut(BaseModel):
    locale: str
    title: str
    subtitle: str
    cards: List[TariffCardOut]

    class Config:
        from_attributes = True


class TariffsUpsert(BaseModel):
    title: str = Field(..., min_length=1)
    subtitle: str = Field(..., min_length=1)
    card1_badge: str = Field(..., min_length=1)
    card1_title: str = Field(..., min_length=1)
    card1_price: str = Field(..., min_length=1)
    card1_period: str = Field(..., min_length=1)
    card1_note: str = Field(..., min_length=1)
    card1_features: str = Field(..., min_length=1)
    card1_cta: str = Field(..., min_length=1)
    card2_badge: str = Field(..., min_length=1)
    card2_title: str = Field(..., min_length=1)
    card2_price: str = Field(..., min_length=1)
    card2_period: str = Field(..., min_length=1)
    card2_note: str = Field(..., min_length=1)
    card2_features: str = Field(..., min_length=1)
    card2_cta: str = Field(..., min_length=1)
    card2_popular: bool = True
    card3_badge: str = Field(..., min_length=1)
    card3_title: str = Field(..., min_length=1)
    card3_price: str = Field(..., min_length=1)
    card3_period: str = Field(..., min_length=1)
    card3_note: str = Field(..., min_length=1)
    card3_features: str = Field(..., min_length=1)
    card3_cta: str = Field(..., min_length=1)


class FaqItemOut(BaseModel):
    question: str
    answer: str


class FaqOut(BaseModel):
    locale: str
    title: str
    items: List[FaqItemOut]

    class Config:
        from_attributes = True


class FaqUpsert(BaseModel):
    title: str = Field(..., min_length=1)
    items: str = Field(..., min_length=1)


class LandingContentOut(BaseModel):
    hero: Optional[HeroContentOut] = None
    review_cta: Optional[ReviewCtaOut] = None
    functions: Optional[FunctionsOut] = None
    steps: Optional[StepsOut] = None
    reviews: Optional[ReviewsOut] = None
    bot: Optional[BotOut] = None
    tariffs: Optional[TariffsOut] = None
    faq: Optional[FaqOut] = None
