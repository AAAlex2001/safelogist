from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, UniqueConstraint

from models.base import Base


class LandingHero(Base):
    __tablename__ = "landing_hero"
    __table_args__ = (
        UniqueConstraint("locale", name="uq_landing_hero_locale"),
    )

    id = Column(Integer, primary_key=True, index=True)
    locale = Column(String(10), nullable=False, index=True)

    title = Column(String, nullable=False)
    title_highlight = Column(String, nullable=True)
    subtitle = Column(String, nullable=False)

    stat_companies_label = Column(String, nullable=False)
    stat_companies_value = Column(Integer, nullable=False)
    stat_companies_suffix = Column(String(20), nullable=True)

    stat_reviews_label = Column(String, nullable=False)
    stat_reviews_value = Column(Integer, nullable=False)
    stat_reviews_suffix = Column(String(20), nullable=True)

    stat_countries_label = Column(String, nullable=False)
    stat_countries_value = Column(Integer, nullable=False)
    stat_countries_suffix = Column(String(20), nullable=True)

    stat_sources_label = Column(String, nullable=False)
    stat_sources_value = Column(Integer, nullable=False)
    stat_sources_suffix = Column(String(20), nullable=True)

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class LandingReviewCta(Base):
    __tablename__ = "landing_review_cta"
    __table_args__ = (
        UniqueConstraint("locale", name="uq_landing_review_cta_locale"),
    )

    id = Column(Integer, primary_key=True, index=True)
    locale = Column(String(10), nullable=False, index=True)

    text = Column(String, nullable=False)
    highlight = Column(String, nullable=True)
    link_url = Column(String, nullable=False)

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class LandingFunctions(Base):
    __tablename__ = "landing_functions"
    __table_args__ = (
        UniqueConstraint("locale", name="uq_landing_functions_locale"),
    )

    id = Column(Integer, primary_key=True, index=True)
    locale = Column(String(10), nullable=False, index=True)

    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=False)

    tab1_label = Column(String, nullable=False)
    tab2_label = Column(String, nullable=False)

    tab1_item1_title = Column(String, nullable=False)
    tab1_item1_text = Column(String, nullable=False)
    tab1_item2_title = Column(String, nullable=False)
    tab1_item2_text = Column(String, nullable=False)
    tab1_item3_title = Column(String, nullable=False)
    tab1_item3_text = Column(String, nullable=False)
    tab1_item4_title = Column(String, nullable=False)
    tab1_item4_text = Column(String, nullable=False)

    tab2_item1_title = Column(String, nullable=False)
    tab2_item1_text = Column(String, nullable=False)
    tab2_item2_title = Column(String, nullable=False)
    tab2_item2_text = Column(String, nullable=False)
    tab2_item3_title = Column(String, nullable=False)
    tab2_item3_text = Column(String, nullable=False)
    tab2_item4_title = Column(String, nullable=False)
    tab2_item4_text = Column(String, nullable=False)

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class LandingSteps(Base):
    __tablename__ = "landing_steps"
    __table_args__ = (
        UniqueConstraint("locale", name="uq_landing_steps_locale"),
    )

    id = Column(Integer, primary_key=True, index=True)
    locale = Column(String(10), nullable=False, index=True)

    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=False)

    step1_counter = Column(String, nullable=False)
    step1_title = Column(String, nullable=False)
    step1_text = Column(String, nullable=False)

    step2_counter = Column(String, nullable=False)
    step2_title = Column(String, nullable=False)
    step2_text = Column(String, nullable=False)

    step3_counter = Column(String, nullable=False)
    step3_title = Column(String, nullable=False)
    step3_text = Column(String, nullable=False)

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class LandingReviews(Base):
    __tablename__ = "landing_reviews"
    __table_args__ = (
        UniqueConstraint("locale", name="uq_landing_reviews_locale"),
    )

    id = Column(Integer, primary_key=True, index=True)
    locale = Column(String(10), nullable=False, index=True)

    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=False)

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class LandingBot(Base):
    __tablename__ = "landing_bot"
    __table_args__ = (
        UniqueConstraint("locale", name="uq_landing_bot_locale"),
    )

    id = Column(Integer, primary_key=True, index=True)
    locale = Column(String(10), nullable=False, index=True)

    title = Column(String, nullable=False)
    subtitle_text = Column(String, nullable=False)
    subtitle_link_text = Column(String, nullable=False)
    subtitle_link_url = Column(String, nullable=False)
    subtitle_after_link = Column(String, nullable=True)

    item1_title = Column(String, nullable=False)
    item1_text = Column(String, nullable=False)
    item2_title = Column(String, nullable=False)
    item2_text = Column(String, nullable=False)
    item3_title = Column(String, nullable=False)
    item3_text = Column(String, nullable=False)

    bot_handle = Column(String, nullable=False)
    bot_url = Column(String, nullable=False)

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class LandingTariffs(Base):
    __tablename__ = "landing_tariffs"
    __table_args__ = (
        UniqueConstraint("locale", name="uq_landing_tariffs_locale"),
    )

    id = Column(Integer, primary_key=True, index=True)
    locale = Column(String(10), nullable=False, index=True)

    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=False)

    card1_badge = Column(String, nullable=False)
    card1_title = Column(String, nullable=False)
    card1_price = Column(String, nullable=False)
    card1_period = Column(String, nullable=False)
    card1_note = Column(String, nullable=False)
    card1_features = Column(Text, nullable=False)
    card1_cta = Column(String, nullable=False)

    card2_badge = Column(String, nullable=False)
    card2_title = Column(String, nullable=False)
    card2_price = Column(String, nullable=False)
    card2_period = Column(String, nullable=False)
    card2_note = Column(String, nullable=False)
    card2_features = Column(Text, nullable=False)
    card2_cta = Column(String, nullable=False)
    card2_popular = Column(Boolean, default=True)

    card3_badge = Column(String, nullable=False)
    card3_title = Column(String, nullable=False)
    card3_price = Column(String, nullable=False)
    card3_period = Column(String, nullable=False)
    card3_note = Column(String, nullable=False)
    card3_features = Column(Text, nullable=False)
    card3_cta = Column(String, nullable=False)

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class LandingFaq(Base):
    __tablename__ = "landing_faq"
    __table_args__ = (
        UniqueConstraint("locale", name="uq_landing_faq_locale"),
    )

    id = Column(Integer, primary_key=True, index=True)
    locale = Column(String(10), nullable=False, index=True)

    title = Column(String, nullable=False)

    items = Column(Text, nullable=False)

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
