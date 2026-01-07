"""add reviews_count and rating to steps cards

Revision ID: f8a9b0c1d2e3
Revises: f7a8b9c0d1e2
Create Date: 2026-01-07 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f8a9b0c1d2e3'
down_revision: Union[str, None] = 'f7a8b9c0d1e2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add reviews_count and rating columns to landing_steps_cards
    op.add_column('landing_steps_cards', sa.Column('reviews_count', sa.Integer(), nullable=True))
    op.add_column('landing_steps_cards', sa.Column('rating', sa.Float(), nullable=True))


def downgrade() -> None:
    # Remove reviews_count and rating columns from landing_steps_cards
    op.drop_column('landing_steps_cards', 'rating')
    op.drop_column('landing_steps_cards', 'reviews_count')
