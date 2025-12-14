"""add company_claims table

Revision ID: a53ae9ab037e
Revises: ee4dd88217e3
Create Date: 2025-12-14 13:51:39.403952

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'a53ae9ab037e'
down_revision: Union[str, None] = 'ee4dd88217e3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'company_claims',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('last_name', sa.String(), nullable=False),
        sa.Column('first_name', sa.String(), nullable=False),
        sa.Column('middle_name', sa.String(), nullable=True),
        sa.Column('phone', sa.String(), nullable=False),
        sa.Column('company_name', sa.String(), nullable=False),
        sa.Column('position', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('document_path', sa.String(), nullable=False),
        sa.Column('document_name', sa.String(), nullable=False),
        sa.Column('status', sa.Enum('PENDING', 'APPROVED', 'REJECTED', name='claimstatus'), nullable=False),
        sa.Column('admin_comment', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_company_claims_id'), 'company_claims', ['id'], unique=False)
    op.create_index(op.f('ix_company_claims_company_name'), 'company_claims', ['company_name'], unique=False)
    op.create_index(op.f('ix_company_claims_email'), 'company_claims', ['email'], unique=False)
    op.create_index(op.f('ix_company_claims_status'), 'company_claims', ['status'], unique=False)

def downgrade() -> None:
    op.drop_index(op.f('ix_company_claims_status'), table_name='company_claims')
    op.drop_index(op.f('ix_company_claims_email'), table_name='company_claims')
    op.drop_index(op.f('ix_company_claims_company_name'), table_name='company_claims')
    op.drop_index(op.f('ix_company_claims_id'), table_name='company_claims')
    op.drop_table('company_claims')
    sa.Enum(name='claimstatus').drop(op.get_bind(), checkfirst=True)
