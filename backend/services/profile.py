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
        old_company_name = user.company_name
        old_photo = user.photo
        
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
        
        # Синхронизация с таблицей companies
        from models.company import Company
        
        # Если company_name изменилось
        if old_company_name != user.company_name:
            # Удаляем владельца у старой компании (если была)
            if old_company_name:
                old_company_query = select(Company).where(Company.name == old_company_name)
                old_company_result = await self.db.execute(old_company_query)
                old_company = old_company_result.scalars().first()
                if old_company and old_company.owner_user_id == user.id:
                    old_company.owner_user_id = None
                    self.db.add(old_company)
            
            # Устанавливаем владельца у новой компании
            if user.company_name:
                new_company_query = select(Company).where(Company.name == user.company_name)
                new_company_result = await self.db.execute(new_company_query)
                new_company = new_company_result.scalars().first()
                
                if new_company:
                    new_company.owner_user_id = user.id
                    self.db.add(new_company)
                else:
                    # Создаем новую компанию, если её нет
                    new_company = Company(
                        name=user.company_name,
                        owner_user_id=user.id,
                        reviews_count=0
                    )
                    self.db.add(new_company)
                
                await self.db.commit()
                print(f"✅ Синхронизация: владелец компании '{user.company_name}' обновлен (user_id={user.id})")
        
        # Синхронизируем фото и контактные данные с companies (если пользователь - владелец)
        if user.company_name:
            company_query = select(Company).where(Company.name == user.company_name)
            company_result = await self.db.execute(company_query)
            company = company_result.scalars().first()
            
            if company and company.owner_user_id == user.id:
                # Синхронизируем данные
                updated = False
                
                # Фото (логотип компании = фото пользователя)
                if user.photo != old_photo or company.logo != user.photo:
                    company.logo = user.photo
                    updated = True
                
                # Контактные данные
                if company.contact_email != user.email:
                    company.contact_email = user.email
                    updated = True
                
                if company.contact_phone != user.phone:
                    company.contact_phone = user.phone
                    updated = True
                
                if company.contact_person != user.name:
                    company.contact_person = user.name
                    updated = True
                
                if updated:
                    self.db.add(company)
                    await self.db.commit()
                    print(f"✅ Данные компании '{user.company_name}' синхронизированы с профилем")
        
        return user

    # -------------------------------------------------------------
    # 3. Смена пароля
    # -------------------------------------------------------------
    async def change_password(self, user: User, new_password: str) -> None:
        # Проверяем длину нового пароля
        if len(new_password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пароль должен быть минимум 8 символов"
            )

        # Хэшируем и сохраняем новый пароль
        user.password = hash_password(new_password)
        await self.db.commit()
