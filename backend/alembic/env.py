from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config
from alembic import context

import os
import sys
from pathlib import Path

# Добавляем корневую директорию проекта в путь
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

# Импортируем Base и все модели
from models.base import Base
from models.user import User
from models.forgot_password import PasswordResetCode
from models.moldovafinreport import MoldovaFinReport
from models.review import Review
from models.company import Company
from models.company_claim import CompanyClaim

# Загружаем переменные окружения
from dotenv import load_dotenv
load_dotenv()

# this is the Alembic Config object
config = context.config

# Интерпретируем файл конфигурации для логирования
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Устанавливаем target_metadata из Base
target_metadata = Base.metadata

# Получаем DATABASE_URL из переменных окружения или из alembic.ini
database_url = os.getenv("DATABASE_URL")
if database_url:
    config.set_main_option("sqlalchemy.url", database_url)


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async def run_async_migrations():
        async with connectable.connect() as connection:
            await connection.run_sync(do_run_migrations)
        await connectable.dispose()

    import asyncio
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()