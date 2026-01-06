"""drop middle_name from company_claims

Revision ID: b1c_drop_middle_name
Revises: a53ae9ab037e
Create Date: 2026-01-06 12:00:00.000000

"""
from typing import Union, Sequence

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'b1c_drop_middle_name'
down_revision: Union[str, None] = 'e2f3g4h5i6j7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop the middle_name column from company_claims
    with op.batch_alter_table('company_claims') as batch_op:
        batch_op.drop_column('middle_name')


def downgrade() -> None:
    # Recreate middle_name column on downgrade
    with op.batch_alter_table('company_claims') as batch_op:
        batch_op.add_column(sa.Column('middle_name', sa.String(), nullable=True))
