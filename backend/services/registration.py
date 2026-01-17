from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timedelta
import random
import re

from models.user import User
from models.codes import VerificationCode
from schemas.registration import UserRegistration
from helpers.security import hash_password
from helpers.email import send_email_code
from services.telegram_notifier import telegram_notifier


class RegistrationService:
    CODE_EXPIRE_MINUTES = 10

    def __init__(self, db: AsyncSession):
        self.db = db

    # ---------------------------------------------------------
    # 1. Проверка email
    # ---------------------------------------------------------
    async def get_user_by_email(self, email: str) -> User | None:
        query = select(User).where(User.email == email)
        result = await self.db.execute(query)
        return result.scalars().first()

    # ---------------------------------------------------------
    # 2. Проверка phone
    # ---------------------------------------------------------
    async def get_user_by_phone(self, phone: str) -> User | None:
        query = select(User).where(User.phone == phone)
        result = await self.db.execute(query)
        return result.scalars().first()

    # ---------------------------------------------------------
    # 3. Отправка кода верификации email
    # ---------------------------------------------------------
    async def send_verification_code(self, email: str) -> None:
        # Проверяем, не занят ли email
        if await self.get_user_by_email(email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь с таким email уже существует",
            )

        # Удаляем старые коды для этого email
        await self.db.execute(
            delete(VerificationCode).where(VerificationCode.email == email)
        )

        code: int = random.randint(100000, 999999)

        verification_code = VerificationCode(
            email=email,
            user_id=None,  # для регистрации user_id не нужен
            code=str(code),
            expires_at=datetime.utcnow() + timedelta(minutes=self.CODE_EXPIRE_MINUTES),
        )

        self.db.add(verification_code)
        await self.db.commit()
        await send_email_code(email, str(code))

    # ---------------------------------------------------------
    # 4. Проверка кода верификации
    # ---------------------------------------------------------
    async def verify_code(self, email: str, code: str) -> bool:
        result = await self.db.execute(
            select(VerificationCode).where(
                VerificationCode.email == email,
                VerificationCode.code == code
            )
        )
        code_obj = result.scalars().first()

        if not code_obj:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Неверный код"
            )

        if code_obj.expires_at < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Код истёк"
            )

        return True

    # ---------------------------------------------------------
    # 5. Создание пользователя
    # ---------------------------------------------------------
    async def create_user(self, data: UserRegistration) -> User:
        # Простая валидация пароля
        if len(data.password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пароль должен содержать не менее 8 символов",
            )

        # Нормализация телефона: оставляем только цифры
        normalized_phone = re.sub(r"\D", "", data.phone or "")
        if not normalized_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Некорректный номер телефона",
            )

        # Проверка email
        if await self.get_user_by_email(data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь с таким email уже существует",
            )

        # Проверка телефона
        if await self.get_user_by_phone(normalized_phone):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь с таким номером уже существует",
            )

        # Создание пользователя
        new_user = User(
            company_name=data.company_name,
            role=data.role,
            phone=normalized_phone,
            email=data.email,
            password=hash_password(data.password),
        )

        self.db.add(new_user)
        try:
            await self.db.commit()
            await self.db.refresh(new_user)
        except IntegrityError:
            # В случае гонки на уровне БД — откат и явная ошибка для клиента
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь с таким email или номером уже существует",
            )
        
        # Отправляем уведомление в Telegram группу
        await telegram_notifier.notify_user_registration(
            user_name=new_user.company_name or "Не указано",
            user_email=new_user.email,
            user_phone=new_user.phone,
            user_role=new_user.role.value,
            user_id=new_user.id
        )

        return new_user
