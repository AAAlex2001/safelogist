"""rename_password_reset_codes_to_verification_codes

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
    # Переименовываем таблицу
    op.rename_table('password_reset_codes', 'verification_codes')
    
    # Добавляем поле email
    op.add_column('verification_codes', sa.Column('email', sa.String(), nullable=True))
    op.create_index(op.f('ix_verification_codes_email'), 'verification_codes', ['email'], unique=False)
    
    # Делаем user_id nullable (для регистрации user_id = NULL)
    op.alter_column('verification_codes', 'user_id', nullable=True)


def downgrade() -> None:
    op.alter_column('verification_codes', 'user_id', nullable=False)
    op.drop_index(op.f('ix_verification_codes_email'), table_name='verification_codes')
    op.drop_column('verification_codes', 'email')
    op.rename_table('verification_codes', 'password_reset_codes')
