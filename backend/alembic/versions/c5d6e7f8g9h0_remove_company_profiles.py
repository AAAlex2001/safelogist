"""remove company_profiles table

Revision ID: c5d6e7f8g9h0
Revises: b1c2d3e4f5a6
Create Date: 2025-12-20 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'c5d6e7f8g9h0'
down_revision: Union[str, None] = 'b1c2d3e4f5a6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Удаляем таблицу company_profiles, т.к. профили компаний теперь 
    управляются через модель User (поле company_name)
    """
    # Удаляем индексы
    op.drop_index(op.f('ix_company_profiles_owner_user_id'), table_name='company_profiles', if_exists=True)
    op.drop_index(op.f('ix_company_profiles_company_name'), table_name='company_profiles', if_exists=True)
    op.drop_index(op.f('ix_company_profiles_id'), table_name='company_profiles', if_exists=True)
    
    # Удаляем таблицу (CASCADE автоматически удалит все зависимости)
    op.drop_table('company_profiles', if_exists=True)


def downgrade() -> None:
    """
    Восстанавливаем таблицу company_profiles (на случай отката)
    """
    op.create_table(
        'company_profiles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('company_name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('website', sa.String(), nullable=True),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('address', sa.Text(), nullable=True),
        sa.Column('logo', sa.String(), nullable=True),
        sa.Column('legal_form', sa.String(), nullable=True),
        sa.Column('inn', sa.String(), nullable=True),
        sa.Column('ogrn', sa.String(), nullable=True),
        sa.Column('registration_number', sa.String(), nullable=True),
        sa.Column('country', sa.String(), nullable=True),
        sa.Column('jurisdiction', sa.String(), nullable=True),
        sa.Column('owner_user_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='false'),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['owner_user_id'], ['users.id'], ),
    )
    op.create_index(op.f('ix_company_profiles_id'), 'company_profiles', ['id'], unique=False)
    op.create_index(op.f('ix_company_profiles_company_name'), 'company_profiles', ['company_name'], unique=True)
    op.create_index(op.f('ix_company_profiles_owner_user_id'), 'company_profiles', ['owner_user_id'], unique=False)
