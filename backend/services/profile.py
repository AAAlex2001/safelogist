import uuid
import os
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.user import User, UserRole
from helpers.security import verify_password, hash_password



UPLOAD_DIR = "static/user_photos"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class ProfileService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # -------------------------------------------------------------
    # 1. Получение профиля
    # -------------------------------------------------------------
    async def get_profile(self, user_id: int) -> User:
        query = select(User).where(User.id == user_id)
        result = await self.db.execute(query)
        user = result.scalars().first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден"
            )

        return user

    # -------------------------------------------------------------
    # 2. Обновление профиля + фото
    # -------------------------------------------------------------
    async def update_profile(self, user: User, data: dict, photo: UploadFile | None) -> User:

        # обновление текстовых полей
        for key, value in data.items():
            if value is not None:
                # Конвертируем role в enum если это поле role
                if key == "role":
                    try:
                        user.role = UserRole(value)
                    except ValueError:
                        # Если невалидное значение, игнорируем
                        pass
                else:
                    setattr(user, key, value)

        # обновление фото
        if photo:
            ext = photo.filename.split(".")[-1]
            filename = f"{uuid.uuid4()}.{ext}"
            filepath = os.path.join(UPLOAD_DIR, filename)

            with open(filepath, "wb") as f:
                f.write(await photo.read())

            user.photo = filename

        await self.db.commit()
        await self.db.refresh(user)
        return user

    # -------------------------------------------------------------
    # 3. Смена пароля
    # -------------------------------------------------------------
    async def change_password(self, user: User, current_password: str, new_password: str) -> None:
        # Проверяем текущий пароль
        if not verify_password(current_password, user.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Неверный текущий пароль"
            )

        # Проверяем длину нового пароля
        if len(new_password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пароль должен быть минимум 8 символов"
            )

        # Хэшируем и сохраняем новый пароль
        user.password = hash_password(new_password)
        await self.db.commit()
