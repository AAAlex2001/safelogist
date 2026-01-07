"""add text fields to steps cards

Revision ID: f9a0b1c2d3e4
Revises: f8a9b0c1d2e3
Create Date: 2026-01-07 12:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f9a0b1c2d3e4'
down_revision: Union[str, None] = 'f8a9b0c1d2e3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add text fields for reviews_text and rating_label to landing_steps_cards
    op.add_column('landing_steps_cards', sa.Column('reviews_text', sa.String(), nullable=True))
    op.add_column('landing_steps_cards', sa.Column('rating_label', sa.String(), nullable=True))


def downgrade() -> None:
    # Remove text fields from landing_steps_cards
    op.drop_column('landing_steps_cards', 'rating_label')
    op.drop_column('landing_steps_cards', 'reviews_text')
