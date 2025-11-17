from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.user import User
from schemas.registration import UserRegistration
from passlib.context import CryptContext
from fastapi import HTTPException, status


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class RegistrationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # ---------------------------------------------------------
    # 1. Хеширование пароля
    # ---------------------------------------------------------
    def hash_password(self, password: str) -> str:
        return pwd_context.hash(password)

    # ---------------------------------------------------------
    # 2. Проверка email
    # ---------------------------------------------------------
    async def get_user_by_email(self, email: str) -> User | None:
        query = select(User).where(User.email == email)
        result = await self.db.execute(query)
        return result.scalars().first()

    # ---------------------------------------------------------
    # 3. Проверка phone
    # ---------------------------------------------------------
    async def get_user_by_phone(self, phone: str) -> User | None:
        query = select(User).where(User.phone == phone)
        result = await self.db.execute(query)
        return result.scalars().first()

    # ---------------------------------------------------------
    # 4. Создание пользователя
    # ---------------------------------------------------------
    async def create_user(self, data: UserRegistration) -> User:
        # Проверка email
        if await self.get_user_by_email(data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь с таким email уже существует",
            )

        # Проверка телефона
        if await self.get_user_by_phone(data.phone):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь с таким номером уже существует",
            )

        # Создание пользователя
        new_user = User(
            first_name=data.first_name,
            role=data.role,
            phone=data.phone,
            email=data.email,
            password=self.hash_password(data.password),
        )

        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)

        return new_user
