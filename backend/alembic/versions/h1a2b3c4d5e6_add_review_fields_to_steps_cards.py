"""add review fields to steps cards

Revision ID: h1a2b3c4d5e6
Revises: g0a1b2c3d4e5
Create Date: 2026-01-07 13:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'h1a2b3c4d5e6'
down_revision: Union[str, None] = 'g0a1b2c3d4e5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add review fields to landing_steps_cards
    op.add_column('landing_steps_cards', sa.Column('author_name', sa.String(), nullable=True))
    op.add_column('landing_steps_cards', sa.Column('author_role', sa.String(), nullable=True))
    op.add_column('landing_steps_cards', sa.Column('author_company', sa.String(), nullable=True))
    op.add_column('landing_steps_cards', sa.Column('review_text', sa.String(), nullable=True))


def downgrade() -> None:
    # Remove review fields from landing_steps_cards
    op.drop_column('landing_steps_cards', 'review_text')
    op.drop_column('landing_steps_cards', 'author_company')
    op.drop_column('landing_steps_cards', 'author_role')
    op.drop_column('landing_steps_cards', 'author_name')
