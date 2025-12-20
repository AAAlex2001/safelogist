"""add_company_editable_fields

Revision ID: 9495c6a78983
Revises: f995c7f719b9
Create Date: 2025-12-20 22:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9495c6a78983'
down_revision: Union[str, None] = 'f995c7f719b9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Добавляем редактируемые поля в таблицу companies
    op.add_column('companies', sa.Column('logo', sa.String(), nullable=True))
    op.add_column('companies', sa.Column('description', sa.Text(), nullable=True))
    op.add_column('companies', sa.Column('website', sa.String(), nullable=True))
    op.add_column('companies', sa.Column('contact_phone', sa.String(), nullable=True))
    op.add_column('companies', sa.Column('contact_email', sa.String(), nullable=True))
    op.add_column('companies', sa.Column('contact_person', sa.String(), nullable=True))


def downgrade() -> None:
    # Откат изменений
    op.drop_column('companies', 'contact_person')
    op.drop_column('companies', 'contact_email')
    op.drop_column('companies', 'contact_phone')
    op.drop_column('companies', 'website')
    op.drop_column('companies', 'description')
    op.drop_column('companies', 'logo')

