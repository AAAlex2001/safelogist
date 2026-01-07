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
    image: Optional[str] = None


class StepsCardOut(BaseModel):
    id: int
    title: str
    description: str
    icon: Optional[str] = None
    card_type: Optional[str] = None
    reviews_count: Optional[int] = None
    reviews_text: Optional[str] = None
    rating: Optional[float] = None
    rating_label: Optional[str] = None
    author_name: Optional[str] = None
    author_role: Optional[str] = None
    author_company: Optional[str] = None
    review_text: Optional[str] = None
    from_label: Optional[str] = None
    order: int

    class Config:
        from_attributes = True


class StepsOut(BaseModel):
    locale: str
    title: str
    subtitle: str
    steps: List[StepItemOut]
    step2_image: Optional[str] = None
    cards: List[StepsCardOut]

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
    step2_image: Optional[str] = None
    step3_counter: str = Field(..., min_length=1)
    step3_title: str = Field(..., min_length=1)
    step3_text: str = Field(..., min_length=1)


class StepsCardCreate(BaseModel):
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    icon: Optional[str] = None
    card_type: Optional[str] = None
    reviews_count: Optional[int] = None
    reviews_text: Optional[str] = None
    rating: Optional[float] = None
    rating_label: Optional[str] = None
    author_name: Optional[str] = None
    author_role: Optional[str] = None
    author_company: Optional[str] = None
    review_text: Optional[str] = None
    from_label: Optional[str] = None
    order: int = 0


class StepsCardUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = Field(None, min_length=1)
    icon: Optional[str] = None
    card_type: Optional[str] = None
    reviews_count: Optional[int] = None
    reviews_text: Optional[str] = None
    rating: Optional[float] = None
    rating_label: Optional[str] = None
    author_name: Optional[str] = None
    author_role: Optional[str] = None
    author_company: Optional[str] = None
    review_text: Optional[str] = None
    from_label: Optional[str] = None
    order: Optional[int] = None


class ReviewsOut(BaseModel):
    locale: str
    title: str
    subtitle: str
    items: List['ReviewItemOut']

    class Config:
        from_attributes = True


class ReviewsUpsert(BaseModel):
    title: str = Field(..., min_length=1)
    subtitle: str = Field(..., min_length=1)


class ReviewItemOut(BaseModel):
    id: int
    author_name: str
    author_role: str
    author_company: Optional[str] = None
    author_avatar: Optional[str] = None
    rating: int
    text: str
    from_label: Optional[str] = None
    rating_label: Optional[str] = None
    order: int

    class Config:
        from_attributes = True


class ReviewItemCreate(BaseModel):
    author_name: str = Field(..., min_length=1)
    author_role: str = Field(..., min_length=1)
    author_company: Optional[str] = None
    author_avatar: Optional[str] = None
    rating: int = Field(..., ge=0, le=5)
    text: str = Field(..., min_length=1)
    from_label: Optional[str] = None
    rating_label: Optional[str] = None
    order: int = 0


class ReviewItemUpdate(BaseModel):
    author_name: Optional[str] = Field(None, min_length=1)
    author_role: Optional[str] = Field(None, min_length=1)
    author_company: Optional[str] = None
    author_avatar: Optional[str] = None
    rating: Optional[int] = Field(None, ge=0, le=5)
    text: Optional[str] = Field(None, min_length=1)
    from_label: Optional[str] = None
    rating_label: Optional[str] = None
    order: Optional[int] = None


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
    title: Optional[str] = None
    subtitle: Optional[str] = None
    card1_badge: Optional[str] = None
    card1_title: Optional[str] = None
    card1_price: Optional[str] = None
    card1_period: Optional[str] = None
    card1_note: Optional[str] = None
    card1_features: Optional[str] = None
    card1_cta: Optional[str] = None
    card2_badge: Optional[str] = None
    card2_title: Optional[str] = None
    card2_price: Optional[str] = None
    card2_period: Optional[str] = None
    card2_note: Optional[str] = None
    card2_features: Optional[str] = None
    card2_cta: Optional[str] = None
    card2_popular: Optional[bool] = True
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
