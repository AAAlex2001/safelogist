"""add landing sections tables

Revision ID: e4f5a6b7c8d9
Revises: d3e4f5a6b7c8
Create Date: 2026-01-07

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "e4f5a6b7c8d9"
down_revision: Union[str, None] = "d3e4f5a6b7c8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "landing_review_cta",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("locale", sa.String(length=10), nullable=False),
        sa.Column("text", sa.String(), nullable=False),
        sa.Column("highlight", sa.String(), nullable=True),
        sa.Column("link_url", sa.String(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("locale", name="uq_landing_review_cta_locale"),
    )
    op.create_index(op.f("ix_landing_review_cta_id"), "landing_review_cta", ["id"], unique=False)
    op.create_index(op.f("ix_landing_review_cta_locale"), "landing_review_cta", ["locale"], unique=False)

    op.create_table(
        "landing_functions",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("locale", sa.String(length=10), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("subtitle", sa.String(), nullable=False),
        sa.Column("tab1_label", sa.String(), nullable=False),
        sa.Column("tab2_label", sa.String(), nullable=False),
        sa.Column("tab1_item1_title", sa.String(), nullable=False),
        sa.Column("tab1_item1_text", sa.String(), nullable=False),
        sa.Column("tab1_item2_title", sa.String(), nullable=False),
        sa.Column("tab1_item2_text", sa.String(), nullable=False),
        sa.Column("tab1_item3_title", sa.String(), nullable=False),
        sa.Column("tab1_item3_text", sa.String(), nullable=False),
        sa.Column("tab1_item4_title", sa.String(), nullable=False),
        sa.Column("tab1_item4_text", sa.String(), nullable=False),
        sa.Column("tab2_item1_title", sa.String(), nullable=False),
        sa.Column("tab2_item1_text", sa.String(), nullable=False),
        sa.Column("tab2_item2_title", sa.String(), nullable=False),
        sa.Column("tab2_item2_text", sa.String(), nullable=False),
        sa.Column("tab2_item3_title", sa.String(), nullable=False),
        sa.Column("tab2_item3_text", sa.String(), nullable=False),
        sa.Column("tab2_item4_title", sa.String(), nullable=False),
        sa.Column("tab2_item4_text", sa.String(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("locale", name="uq_landing_functions_locale"),
    )
    op.create_index(op.f("ix_landing_functions_id"), "landing_functions", ["id"], unique=False)
    op.create_index(op.f("ix_landing_functions_locale"), "landing_functions", ["locale"], unique=False)

    op.create_table(
        "landing_steps",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("locale", sa.String(length=10), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("subtitle", sa.String(), nullable=False),
        sa.Column("step1_counter", sa.String(), nullable=False),
        sa.Column("step1_title", sa.String(), nullable=False),
        sa.Column("step1_text", sa.String(), nullable=False),
        sa.Column("step2_counter", sa.String(), nullable=False),
        sa.Column("step2_title", sa.String(), nullable=False),
        sa.Column("step2_text", sa.String(), nullable=False),
        sa.Column("step3_counter", sa.String(), nullable=False),
        sa.Column("step3_title", sa.String(), nullable=False),
        sa.Column("step3_text", sa.String(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("locale", name="uq_landing_steps_locale"),
    )
    op.create_index(op.f("ix_landing_steps_id"), "landing_steps", ["id"], unique=False)
    op.create_index(op.f("ix_landing_steps_locale"), "landing_steps", ["locale"], unique=False)

    op.create_table(
        "landing_reviews",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("locale", sa.String(length=10), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("subtitle", sa.String(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("locale", name="uq_landing_reviews_locale"),
    )
    op.create_index(op.f("ix_landing_reviews_id"), "landing_reviews", ["id"], unique=False)
    op.create_index(op.f("ix_landing_reviews_locale"), "landing_reviews", ["locale"], unique=False)

    op.create_table(
        "landing_bot",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("locale", sa.String(length=10), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("subtitle_text", sa.String(), nullable=False),
        sa.Column("subtitle_link_text", sa.String(), nullable=False),
        sa.Column("subtitle_link_url", sa.String(), nullable=False),
        sa.Column("subtitle_after_link", sa.String(), nullable=True),
        sa.Column("item1_title", sa.String(), nullable=False),
        sa.Column("item1_text", sa.String(), nullable=False),
        sa.Column("item2_title", sa.String(), nullable=False),
        sa.Column("item2_text", sa.String(), nullable=False),
        sa.Column("item3_title", sa.String(), nullable=False),
        sa.Column("item3_text", sa.String(), nullable=False),
        sa.Column("bot_handle", sa.String(), nullable=False),
        sa.Column("bot_url", sa.String(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("locale", name="uq_landing_bot_locale"),
    )
    op.create_index(op.f("ix_landing_bot_id"), "landing_bot", ["id"], unique=False)
    op.create_index(op.f("ix_landing_bot_locale"), "landing_bot", ["locale"], unique=False)

    op.create_table(
        "landing_tariffs",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("locale", sa.String(length=10), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("subtitle", sa.String(), nullable=False),
        sa.Column("card1_badge", sa.String(), nullable=False),
        sa.Column("card1_title", sa.String(), nullable=False),
        sa.Column("card1_price", sa.String(), nullable=False),
        sa.Column("card1_period", sa.String(), nullable=False),
        sa.Column("card1_note", sa.String(), nullable=False),
        sa.Column("card1_features", sa.Text(), nullable=False),
        sa.Column("card1_cta", sa.String(), nullable=False),
        sa.Column("card2_badge", sa.String(), nullable=False),
        sa.Column("card2_title", sa.String(), nullable=False),
        sa.Column("card2_price", sa.String(), nullable=False),
        sa.Column("card2_period", sa.String(), nullable=False),
        sa.Column("card2_note", sa.String(), nullable=False),
        sa.Column("card2_features", sa.Text(), nullable=False),
        sa.Column("card2_cta", sa.String(), nullable=False),
        sa.Column("card2_popular", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("card3_badge", sa.String(), nullable=False),
        sa.Column("card3_title", sa.String(), nullable=False),
        sa.Column("card3_price", sa.String(), nullable=False),
        sa.Column("card3_period", sa.String(), nullable=False),
        sa.Column("card3_note", sa.String(), nullable=False),
        sa.Column("card3_features", sa.Text(), nullable=False),
        sa.Column("card3_cta", sa.String(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("locale", name="uq_landing_tariffs_locale"),
    )
    op.create_index(op.f("ix_landing_tariffs_id"), "landing_tariffs", ["id"], unique=False)
    op.create_index(op.f("ix_landing_tariffs_locale"), "landing_tariffs", ["locale"], unique=False)

    op.create_table(
        "landing_faq",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("locale", sa.String(length=10), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("items", sa.Text(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("locale", name="uq_landing_faq_locale"),
    )
    op.create_index(op.f("ix_landing_faq_id"), "landing_faq", ["id"], unique=False)
    op.create_index(op.f("ix_landing_faq_locale"), "landing_faq", ["locale"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_landing_faq_locale"), table_name="landing_faq")
    op.drop_index(op.f("ix_landing_faq_id"), table_name="landing_faq")
    op.drop_table("landing_faq")

    op.drop_index(op.f("ix_landing_tariffs_locale"), table_name="landing_tariffs")
    op.drop_index(op.f("ix_landing_tariffs_id"), table_name="landing_tariffs")
    op.drop_table("landing_tariffs")

    op.drop_index(op.f("ix_landing_bot_locale"), table_name="landing_bot")
    op.drop_index(op.f("ix_landing_bot_id"), table_name="landing_bot")
    op.drop_table("landing_bot")

    op.drop_index(op.f("ix_landing_reviews_locale"), table_name="landing_reviews")
    op.drop_index(op.f("ix_landing_reviews_id"), table_name="landing_reviews")
    op.drop_table("landing_reviews")

    op.drop_index(op.f("ix_landing_steps_locale"), table_name="landing_steps")
    op.drop_index(op.f("ix_landing_steps_id"), table_name="landing_steps")
    op.drop_table("landing_steps")

    op.drop_index(op.f("ix_landing_functions_locale"), table_name="landing_functions")
    op.drop_index(op.f("ix_landing_functions_id"), table_name="landing_functions")
    op.drop_table("landing_functions")

    op.drop_index(op.f("ix_landing_review_cta_locale"), table_name="landing_review_cta")
    op.drop_index(op.f("ix_landing_review_cta_id"), table_name="landing_review_cta")
    op.drop_table("landing_review_cta")
