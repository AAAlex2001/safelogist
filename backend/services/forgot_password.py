from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from datetime import datetime, timedelta
import random

from passlib.context import CryptContext

from backend.models.user import User
from backend.models.password_reset import PasswordResetCode
from backend.helpers.email import send_email_code

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class PasswordResetService:
    CODE_EXPIRE_MINUTES = 10

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    # ----------------------------------------------------------------------
    # 1. Запрос кода по email
    # ----------------------------------------------------------------------
    async def request_code(self, email: str) -> None:
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalars().first()

        if not user:
            raise HTTPException(404, "Пользователь с таким email не найден")

        user.password_reset_codes.clear()

        code: int = random.randint(100000, 999999)

        reset_code = PasswordResetCode(
            code=str(code),
            expires_at=datetime.utcnow() + timedelta(minutes=self.CODE_EXPIRE_MINUTES),
        )

        user.password_reset_codes.append(reset_code)

        await self.db.commit()
        await send_email_code(user.email, str(code))

    # ----------------------------------------------------------------------
    # 2. Проверка кода — возвращаем user_id
    # ----------------------------------------------------------------------
    async def verify_code(self, code: str) -> int:
        result = await self.db.execute(
            select(PasswordResetCode).where(PasswordResetCode.code == code)
        )
        code_obj = result.scalars().first()

        if not code_obj:
            raise HTTPException(400, "Неверный код")

        if code_obj.expires_at < datetime.utcnow():
            raise HTTPException(400, "Код истёк")

        return code_obj.user.id

    # ----------------------------------------------------------------------
    # 3. Установка нового пароля (по user_id)
    # ----------------------------------------------------------------------
    async def set_new_password(self, user_id: int, new_password: str) -> None:
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()

        if not user:
            raise HTTPException(404, "Пользователь не найден")

        user.password = pwd_context.hash(new_password)

        # чистим одноразовые коды
        user.password_reset_codes.clear()

        await self.db.commit()
