"""add company_profiles table and update company_claims

Revision ID: b1c2d3e4f5a6
Revises: a53ae9ab037e
Create Date: 2025-12-14 15:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'b1c2d3e4f5a6'
down_revision: Union[str, None] = 'a53ae9ab037e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. Добавляем target_company_id в company_claims
    op.add_column('company_claims', sa.Column('target_company_id', sa.Integer(), nullable=True))
    op.create_index(op.f('ix_company_claims_target_company_id'), 'company_claims', ['target_company_id'], unique=False)

    # 2. Создаем таблицу company_profiles
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

def downgrade() -> None:
    # Откат в обратном порядке
    op.drop_index(op.f('ix_company_profiles_owner_user_id'), table_name='company_profiles')
    op.drop_index(op.f('ix_company_profiles_company_name'), table_name='company_profiles')
    op.drop_index(op.f('ix_company_profiles_id'), table_name='company_profiles')
    op.drop_table('company_profiles')

    op.drop_index(op.f('ix_company_claims_target_company_id'), table_name='company_claims')
    op.drop_column('company_claims', 'target_company_id')
