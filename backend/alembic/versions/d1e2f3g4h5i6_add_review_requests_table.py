"""add review_requests table

Revision ID: d1e2f3g4h5i6
Revises: 9495c6a78983
Create Date: 2024-12-29

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'd1e2f3g4h5i6'
down_revision: Union[str, None] = '9495c6a78983'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'review_requests',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('from_company', sa.String(), nullable=False),
        sa.Column('target_company', sa.String(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('comment', sa.Text(), nullable=False),
        sa.Column('attachment_path', sa.String(), nullable=True),
        sa.Column('attachment_name', sa.String(), nullable=True),
        sa.Column('status', sa.Enum('PENDING', 'APPROVED', 'REJECTED', name='reviewrequeststatus'), nullable=False),
        sa.Column('admin_comment', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_review_requests_id'), 'review_requests', ['id'], unique=False)
    op.create_index(op.f('ix_review_requests_user_id'), 'review_requests', ['user_id'], unique=False)
    op.create_index(op.f('ix_review_requests_from_company'), 'review_requests', ['from_company'], unique=False)
    op.create_index(op.f('ix_review_requests_target_company'), 'review_requests', ['target_company'], unique=False)
    op.create_index(op.f('ix_review_requests_status'), 'review_requests', ['status'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_review_requests_status'), table_name='review_requests')
    op.drop_index(op.f('ix_review_requests_target_company'), table_name='review_requests')
    op.drop_index(op.f('ix_review_requests_from_company'), table_name='review_requests')
    op.drop_index(op.f('ix_review_requests_user_id'), table_name='review_requests')
    op.drop_index(op.f('ix_review_requests_id'), table_name='review_requests')
    op.drop_table('review_requests')
    op.execute("DROP TYPE IF EXISTS reviewrequeststatus")
