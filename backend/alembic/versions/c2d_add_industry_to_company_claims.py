"""add industry to company_claims

Revision ID: c2d_add_industry
Revises: b1c_drop_middle_name
Create Date: 2026-01-06 13:00:00.000000

"""
from typing import Union, Sequence

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'c2d_add_industry'
down_revision: Union[str, None] = 'b1c_drop_middle_name'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add industry column to company_claims table
    with op.batch_alter_table('company_claims') as batch_op:
        batch_op.add_column(sa.Column('industry', sa.Enum('TRANSPORT_COMPANY', 'CARGO_OWNER', 'FORWARDER', 'USER', name='userrole'), nullable=True))


def downgrade() -> None:
    # Drop industry column on downgrade
    with op.batch_alter_table('company_claims') as batch_op:
        batch_op.drop_column('industry')
