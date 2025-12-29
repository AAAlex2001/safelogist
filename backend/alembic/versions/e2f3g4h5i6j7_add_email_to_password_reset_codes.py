"""add_email_to_password_reset_codes

Revision ID: e2f3g4h5i6j7
Revises: d1e2f3g4h5i6
Create Date: 2025-12-29 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e2f3g4h5i6j7'
down_revision: Union[str, None] = 'd1e2f3g4h5i6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Добавляем поле email в существующую таблицу
    op.add_column('password_reset_codes', sa.Column('email', sa.String(), nullable=True))
    op.create_index(op.f('ix_password_reset_codes_email'), 'password_reset_codes', ['email'], unique=False)
    
    # Делаем user_id nullable (для регистрации user_id = NULL)
    op.alter_column('password_reset_codes', 'user_id', nullable=True)


def downgrade() -> None:
    op.alter_column('password_reset_codes', 'user_id', nullable=False)
    op.drop_index(op.f('ix_password_reset_codes_email'), table_name='password_reset_codes')
    op.drop_column('password_reset_codes', 'email')
