"""add from_label to steps cards

Revision ID: i2a3b4c5d6e7
Revises: h1a2b3c4d5e6
Create Date: 2026-01-07 13:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'i2a3b4c5d6e7'
down_revision: Union[str, None] = 'h1a2b3c4d5e6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add from_label field to landing_steps_cards
    op.add_column('landing_steps_cards', sa.Column('from_label', sa.String(), nullable=True))


def downgrade() -> None:
    # Remove from_label field from landing_steps_cards
    op.drop_column('landing_steps_cards', 'from_label')
