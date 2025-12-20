"""add_owner_to_companies

Revision ID: f995c7f719b9
Revises: c5d6e7f8g9h0
Create Date: 2025-12-20 22:11:36.940631

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f995c7f719b9'
down_revision: Union[str, None] = 'c5d6e7f8g9h0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Добавляем колонку owner_user_id в таблицу companies
    op.add_column('companies', sa.Column('owner_user_id', sa.Integer(), nullable=True))
    op.create_index(op.f('ix_companies_owner_user_id'), 'companies', ['owner_user_id'], unique=False)
    op.create_foreign_key('fk_companies_owner_user_id', 'companies', 'users', ['owner_user_id'], ['id'])


def downgrade() -> None:
    # Откат изменений
    op.drop_constraint('fk_companies_owner_user_id', 'companies', type_='foreignkey')
    op.drop_index(op.f('ix_companies_owner_user_id'), table_name='companies')
    op.drop_column('companies', 'owner_user_id')

