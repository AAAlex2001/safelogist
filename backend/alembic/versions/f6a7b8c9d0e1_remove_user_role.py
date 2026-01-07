"""remove user role

Revision ID: f6a7b8c9d0e1
Revises: f5a6b7c8d9e0
Create Date: 2026-01-07

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "f6a7b8c9d0e1"
down_revision: Union[str, None] = "f5a6b7c8d9e0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Обновляем пользователей с ролью USER на CARGO_OWNER
    op.execute("""
        UPDATE users 
        SET role = 'CARGO_OWNER' 
        WHERE role = 'USER'
    """)
    
    # Пересоздаем enum без USER
    op.execute("ALTER TYPE userrole RENAME TO userrole_old")
    op.execute("CREATE TYPE userrole AS ENUM ('TRANSPORT_COMPANY', 'CARGO_OWNER', 'FORWARDER')")
    op.execute("""
        ALTER TABLE users 
        ALTER COLUMN role TYPE userrole 
        USING role::text::userrole
    """)
    op.execute("DROP TYPE userrole_old")


def downgrade() -> None:
    # Восстанавливаем enum с USER
    op.execute("ALTER TYPE userrole RENAME TO userrole_old")
    op.execute("CREATE TYPE userrole AS ENUM ('TRANSPORT_COMPANY', 'CARGO_OWNER', 'FORWARDER', 'USER')")
    op.execute("""
        ALTER TABLE users 
        ALTER COLUMN role TYPE userrole 
        USING role::text::userrole
    """)
    op.execute("DROP TYPE userrole_old")
