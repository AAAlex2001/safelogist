"""add card_type to steps cards

Revision ID: g0a1b2c3d4e5
Revises: f9a0b1c2d3e4
Create Date: 2026-01-07 13:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'g0a1b2c3d4e5'
down_revision: Union[str, None] = 'f9a0b1c2d3e4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add card_type field to landing_steps_cards
    op.add_column('landing_steps_cards', sa.Column('card_type', sa.String(), nullable=True))
    # Set default value for existing records
    op.execute("UPDATE landing_steps_cards SET card_type = 'assessment' WHERE card_type IS NULL")


def downgrade() -> None:
    # Remove card_type field from landing_steps_cards
    op.drop_column('landing_steps_cards', 'card_type')
