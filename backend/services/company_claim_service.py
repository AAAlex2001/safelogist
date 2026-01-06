"""
Сервис для обработки заявок на подтверждение компании
"""
import os
import uuid
from typing import Optional
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models.company_claim import CompanyClaim, ClaimStatus
from models.user import User
from schemas.company_claim import CompanyClaimRequest
from services.telegram_notifier import telegram_notifier


UPLOAD_DIR = "uploads/company_claims"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_MIME_TYPES = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png"
}

MAX_FILE_SIZE = 10 * 1024 * 1024


class CompanyClaimService:
    """Сервис для работы с заявками на подтверждение компании"""

    def __init__(self, db: AsyncSession):
        self.db = db

    def validate_file(self, file: UploadFile) -> None:
        """Валидация загружаемого файла"""

        if file.content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Допустимые форматы: PDF, JPG, PNG"
            )
        pass  # Проверка размера будет после чтения файла

    async def save_file(self, file: UploadFile) -> tuple[str, str]:
        """
        Сохранение файла на диск
        
        Returns:
            tuple[document_path, document_name]: Путь к файлу и оригинальное имя
        """
        self.validate_file(file)
        ext = ALLOWED_MIME_TYPES.get(file.content_type, ".bin")
        filename = f"{uuid.uuid4()}{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        file_content = await file.read()
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Файл превышает 10 МБ"
            )
        with open(filepath, "wb") as f:
            f.write(file_content)
        
        return filepath, file.filename or "document"

    async def create_claim(
        self,
        data: CompanyClaimRequest,
        document: UploadFile,
        target_company_id: Optional[int] = None
    ) -> CompanyClaim:
        """
        Создание новой заявки на подтверждение компании
        
        Args:
            data: Данные формы
            document: Загруженный документ
            target_company_id: ID компании из отзывов (опционально)
            
        Returns:
            CompanyClaim: Созданная заявка
        """
        document_path, document_name = await self.save_file(document)
        claim = CompanyClaim(
            target_company_id=target_company_id,
            last_name=data.last_name,
            first_name=data.first_name,
            phone=data.phone,
            company_name=data.company_name,
            industry=data.industry,
            position=data.position,
            email=data.email,
            document_path=document_path,
            document_name=document_name,
            status=ClaimStatus.PENDING
        )
        
        self.db.add(claim)
        await self.db.commit()
        await self.db.refresh(claim)
        
        # Отправляем уведомление в Telegram группу
        user_name = f"{data.last_name} {data.first_name}"
        
        await telegram_notifier.notify_company_claim(
            company_name=data.company_name,
            user_name=user_name,
            user_email=data.email,
            user_phone=data.phone,
            claim_id=claim.id
        )
        
        return claim

    async def get_claim_by_id(self, claim_id: int) -> CompanyClaim | None:
        """Получить заявку по ID"""
        query = select(CompanyClaim).where(CompanyClaim.id == claim_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_claims_by_company(
        self,
        company_name: str,
        limit: int = 10
    ) -> list[CompanyClaim]:
        """Получить заявки по названию компании"""
        query = (
            select(CompanyClaim)
            .where(CompanyClaim.company_name == company_name)
            .order_by(CompanyClaim.created_at.desc())
            .limit(limit)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def delete_claim(self, claim_id: int) -> bool:
        """
        Удаление заявки и связанного файла

        Args:
            claim_id: ID заявки для удаления

        Returns:
            bool: True если удалено успешно, False если заявка не найдена
        """
        claim = await self.get_claim_by_id(claim_id)
        if not claim:
            return False

        # Удаляем файл, если он существует
        if claim.document_path and os.path.exists(claim.document_path):
            try:
                os.remove(claim.document_path)
            except OSError as e:
                # Логируем ошибку, но продолжаем удаление записи из БД
                print(f"Ошибка при удалении файла {claim.document_path}: {e}")

        # Удаляем запись из БД
        await self.db.delete(claim)
        await self.db.commit()

        return True

    async def approve_claim(self, claim_id: int) -> CompanyClaim:
        """
        Одобрить заявку

        При одобрении:
        1. Получаем реальное название компании из target_company_id (если есть)
        2. Ищем или создаем пользователя по email из заявки
        3. Устанавливаем владельца компании в таблице companies
        4. Отправляем email с учетными данными (если пользователь новый)
        5. Обновляем статус заявки на APPROVED

        Args:
            claim_id: ID заявки для одобрения

        Returns:
            CompanyClaim: Обновленная заявка
        """
        claim = await self.get_claim_by_id(claim_id)
        if not claim:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заявка не найдена"
            )

        # Проверяем, не одобрена ли уже заявка
        if claim.status == ClaimStatus.APPROVED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Заявка уже одобрена"
            )

        # Определяем реальное название компании
        company_name = claim.company_name
        
        # Если заявка подана через кнопку "Это моя компания", получаем название из отзыва
        if claim.target_company_id:
            from models.review import Review
            review_query = select(Review).where(Review.id == claim.target_company_id)
            review_result = await self.db.execute(review_query)
            review = review_result.scalars().first()
            if review and review.subject:
                company_name = review.subject
                print(f"📌 Используем название из отзыва: '{company_name}' (вместо '{claim.company_name}')")

        # Ищем или создаем пользователя
        user_query = select(User).where(User.email == claim.email)
        user_result = await self.db.execute(user_query)
        user = user_result.scalars().first()

        is_new_user = False
        temp_password = None

        if not user:
            # Создаем нового пользователя (пароль будет отправлен по email)
            from helpers.security import hash_password
            from helpers.email import send_account_credentials
            import secrets

            temp_password = secrets.token_urlsafe(16)
            user = User(
                email=claim.email,
                phone=claim.phone,
                password=hash_password(temp_password),
                name=f"{claim.first_name} {claim.last_name}",
                company_name=company_name,  # Используем реальное название
                position=claim.position,
                is_active=True
            )
            self.db.add(user)
            await self.db.flush()  # Получаем ID пользователя
            is_new_user = True
            print(f"✅ Создан новый пользователь с ID: {user.id}")
        else:
            print(f"ℹ️ Пользователь с email {claim.email} уже существует (ID: {user.id})")
            # Обновляем company_name у существующего пользователя
            if user.company_name != company_name:
                print(f"📝 Обновляем company_name: '{user.company_name}' -> '{company_name}'")
                user.company_name = company_name
                self.db.add(user)

        # Обновляем или создаем запись в таблице companies
        from models.company import Company
        company_query = select(Company).where(Company.name == company_name)
        company_result = await self.db.execute(company_query)
        company = company_result.scalars().first()

        if company:
            # Обновляем владельца и контактные данные
            if company.owner_user_id and company.owner_user_id != user.id:
                print(f"⚠️ Компания '{company_name}' уже имеет владельца (ID: {company.owner_user_id})")
            company.owner_user_id = user.id
            company.contact_email = user.email
            company.contact_phone = user.phone
            company.contact_person = user.name
            self.db.add(company)
            print(f"✅ Владелец компании '{company_name}' установлен: user_id={user.id}")
        else:
            # Создаем новую запись компании
            company = Company(
                name=company_name,
                owner_user_id=user.id,
                reviews_count=0,
                contact_email=user.email,
                contact_phone=user.phone,
                contact_person=user.name
            )
            self.db.add(company)
            print(f"✅ Создана новая компания '{company_name}' с владельцем user_id={user.id}")

        # Обновляем статус заявки
        claim.status = ClaimStatus.APPROVED

        await self.db.commit()
        await self.db.refresh(claim)

        # Отправляем email с учетными данными (только для новых пользователей)
        if is_new_user and temp_password:
            try:
                from helpers.email import send_account_credentials
                await send_account_credentials(
                    to_email=claim.email,
                    name=f"{claim.first_name} {claim.last_name}",
                    company_name=company_name,  # Используем реальное название
                    password=temp_password
                )
                print(f"📧 Email с учетными данными отправлен на {claim.email}")
            except Exception as e:
                print(f"❌ Ошибка при отправке email с учетными данными: {str(e)}")
                # Не прерываем процесс одобрения, если email не отправился

        return claim

