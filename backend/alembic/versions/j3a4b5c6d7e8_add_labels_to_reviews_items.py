"""add labels to reviews items

Revision ID: j3a4b5c6d7e8
Revises: i2a3b4c5d6e7
Create Date: 2026-01-07 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'j3a4b5c6d7e8'
down_revision = 'i2a3b4c5d6e7'
branch_labels = None
depends_on = None


def upgrade():
    # Add from_label and rating_label to landing_reviews_items
    op.add_column('landing_reviews_items', sa.Column('from_label', sa.String(), nullable=True, comment='Текст "От:"'))
    op.add_column('landing_reviews_items', sa.Column('rating_label', sa.String(), nullable=True, comment='Текст "Рейтинг"'))


def downgrade():
    op.drop_column('landing_reviews_items', 'rating_label')
    op.drop_column('landing_reviews_items', 'from_label')
