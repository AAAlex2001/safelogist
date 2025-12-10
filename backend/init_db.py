"""
Скрипт для инициализации базы данных - создание всех таблиц
"""
import asyncio
from database import engine
from models.base import Base
from models.user import User
from models.forgot_password import PasswordResetCode
from models.review import Review


async def init_db():
    """Создает все таблицы в базе данных"""
    async with engine.begin() as conn:
        # Создаем все таблицы
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Таблицы успешно созданы!")


if __name__ == "__main__":
    asyncio.run(init_db())

