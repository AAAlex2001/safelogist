"""add steps cards and reviews items

Revision ID: f7a8b9c0d1e2
Revises: f6a7b8c9d0e1
Create Date: 2026-01-07

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "f7a8b9c0d1e2"
down_revision: Union[str, None] = "f6a7b8c9d0e1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Создаём таблицу landing_steps_cards
    op.create_table(
        'landing_steps_cards',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('steps_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('icon', sa.String(), nullable=True),
        sa.Column('order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['steps_id'], ['landing_steps.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_landing_steps_cards_steps_id'), 'landing_steps_cards', ['steps_id'], unique=False)

    # Создаём таблицу landing_reviews_items
    op.create_table(
        'landing_reviews_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('reviews_id', sa.Integer(), nullable=False),
        sa.Column('author_name', sa.String(), nullable=False),
        sa.Column('author_role', sa.String(), nullable=False),
        sa.Column('author_company', sa.String(), nullable=True),
        sa.Column('author_avatar', sa.String(), nullable=True),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['reviews_id'], ['landing_reviews.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_landing_reviews_items_reviews_id'), 'landing_reviews_items', ['reviews_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_landing_reviews_items_reviews_id'), table_name='landing_reviews_items')
    op.drop_table('landing_reviews_items')
    op.drop_index(op.f('ix_landing_steps_cards_steps_id'), table_name='landing_steps_cards')
    op.drop_table('landing_steps_cards')
