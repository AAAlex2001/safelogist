"""add landing_hero table

Revision ID: d3e4f5a6b7c8
Revises: c2d_add_industry
Create Date: 2026-01-06

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "d3e4f5a6b7c8"
down_revision: Union[str, None] = "c2d_add_industry"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "landing_hero",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("locale", sa.String(length=10), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("title_highlight", sa.String(), nullable=True),
        sa.Column("subtitle", sa.String(), nullable=False),
        sa.Column("stat_companies_label", sa.String(), nullable=False),
        sa.Column("stat_companies_value", sa.Integer(), nullable=False),
        sa.Column("stat_companies_suffix", sa.String(length=20), nullable=True),
        sa.Column("stat_reviews_label", sa.String(), nullable=False),
        sa.Column("stat_reviews_value", sa.Integer(), nullable=False),
        sa.Column("stat_reviews_suffix", sa.String(length=20), nullable=True),
        sa.Column("stat_countries_label", sa.String(), nullable=False),
        sa.Column("stat_countries_value", sa.Integer(), nullable=False),
        sa.Column("stat_countries_suffix", sa.String(length=20), nullable=True),
        sa.Column("stat_sources_label", sa.String(), nullable=False),
        sa.Column("stat_sources_value", sa.Integer(), nullable=False),
        sa.Column("stat_sources_suffix", sa.String(length=20), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("locale", name="uq_landing_hero_locale"),
    )
    op.create_index(op.f("ix_landing_hero_id"), "landing_hero", ["id"], unique=False)
    op.create_index(op.f("ix_landing_hero_locale"), "landing_hero", ["locale"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_landing_hero_locale"), table_name="landing_hero")
    op.drop_index(op.f("ix_landing_hero_id"), table_name="landing_hero")
    op.drop_table("landing_hero")
