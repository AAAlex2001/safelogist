from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext
from fastapi import HTTPException, status

from models.user import User
from schemas.login import LoginRequest

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class LoginService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # ---------------------------------------------------------
    # Найти пользователя по email
    # ---------------------------------------------------------
    async def get_user_by_email(self, email: str) -> User | None:
        query = select(User).where(User.email == email)
        result = await self.db.execute(query)
        return result.scalars().first()

    # ---------------------------------------------------------
    # Проверить пароль
    # ---------------------------------------------------------
    def verify_password(self, plain: str, hashed: str) -> bool:
        return pwd_context.verify(plain, hashed)

    # ---------------------------------------------------------
    # Логин
    # ---------------------------------------------------------
    async def login(self, data: LoginRequest) -> User:
        # ищем пользователя
        user = await self.get_user_by_email(data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный email или пароль"
            )

        # проверяем пароль
        if not self.verify_password(data.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный email или пароль"
            )

        return user
