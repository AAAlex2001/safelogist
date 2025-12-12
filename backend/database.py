"""
Настройка подключения к базе данных
"""
import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

# URL подключения к базе данных из переменных окружения
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://safelogist:safelogist_password@localhost:5432/safelogist_db"
)

# Логирование SQL запросов (только в режиме разработки)
ECHO_SQL = os.getenv("ECHO_SQL", "False").lower() == "true"

# Создание движка с пулом соединений
engine = create_async_engine(
    DATABASE_URL,
    echo=ECHO_SQL,
    future=True,
    # Пул соединений - держит соединения открытыми
    # Важно: pool_size + max_overflow не должно превышать max_connections PostgreSQL (100)
    pool_size=30,          # Базовое количество соединений в пуле
    max_overflow=60,       # Дополнительные соединения при нагрузке (итого макс: 90)
    pool_pre_ping=True,    # Проверка соединения перед использованием
    pool_recycle=3600,     # Пересоздание соединений каждый час
    pool_timeout=30,       # Таймаут ожидания соединения (секунды)
)

# Создание фабрики сессий
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncSession:
    """
    Dependency для получения сессии базы данных
    Используется в FastAPI через Depends(get_db)
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()