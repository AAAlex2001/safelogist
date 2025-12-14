"""
Сервис для обработки заявок на подтверждение компании
"""
import os
import uuid
from typing import Optional
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from models.company_claim import CompanyClaim, ClaimStatus
from models.company_profile import CompanyProfile
from models.user import User
from models.review import Review
from schemas.company_claim import CompanyClaimRequest


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
            middle_name=data.middle_name,
            phone=data.phone,
            company_name=data.company_name,
            position=data.position,
            email=data.email,
            document_path=document_path,
            document_name=document_name,
            status=ClaimStatus.PENDING
        )
        
        self.db.add(claim)
        await self.db.commit()
        await self.db.refresh(claim)
        
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

    async def approve_claim(self, claim_id: int) -> CompanyProfile:
        """
        Одобрить заявку и создать профиль компании

        При одобрении:
        1. Ищем или создаем пользователя по email из заявки
        2. Создаем профиль компании (CompanyProfile)
        3. Связываем пользователя с профилем
        4. Синхронизируем данные из reviews (если есть target_company_id)

        Args:
            claim_id: ID заявки для одобрения

        Returns:
            CompanyProfile: Созданный профиль компании
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

        # 1. Ищем или создаем пользователя
        user_query = select(User).where(User.email == claim.email)
        user_result = await self.db.execute(user_query)
        user = user_result.scalars().first()

        if not user:
            # Создаем нового пользователя (пароль будет отправлен по email)
            from helpers.security import hash_password
            import secrets

            temp_password = secrets.token_urlsafe(16)
            user = User(
                email=claim.email,
                phone=claim.phone,
                password=hash_password(temp_password),
                name=f"{claim.first_name} {claim.last_name}",
                company_name=claim.company_name,
                position=claim.position,
                is_active=True
            )
            self.db.add(user)
            await self.db.flush()  # Получаем ID пользователя

            # TODO: Отправить email с временным паролем

        # 2. Проверяем, существует ли уже профиль компании
        profile_query = select(CompanyProfile).where(
            CompanyProfile.company_name == claim.company_name
        )
        profile_result = await self.db.execute(profile_query)
        company_profile = profile_result.scalars().first()

        if company_profile:
            # Если профиль уже существует, обновляем владельца
            if company_profile.owner_user_id and company_profile.owner_user_id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="У этой компании уже есть владелец"
                )
            company_profile.owner_user_id = user.id
        else:
            # 3. Создаем новый профиль компании
            company_profile = CompanyProfile(
                company_name=claim.company_name,
                owner_user_id=user.id,
                email=claim.email,
                phone=claim.phone,
                is_verified=True
            )

            # 4. Синхронизируем данные из reviews (если есть target_company_id)
            if claim.target_company_id:
                review_query = select(Review).where(Review.id == claim.target_company_id)
                review_result = await self.db.execute(review_query)
                review = review_result.scalars().first()

                if review:
                    # Копируем данные из отзыва в профиль компании
                    company_profile.legal_form = review.legal_form
                    company_profile.inn = review.inn
                    company_profile.ogrn = review.ogrn
                    company_profile.registration_number = review.registration_number
                    company_profile.country = review.country
                    company_profile.jurisdiction = review.jurisdiction
                    company_profile.address = review.legal_address

            self.db.add(company_profile)

        # 5. Обновляем статус заявки
        claim.status = ClaimStatus.APPROVED

        await self.db.commit()
        await self.db.refresh(company_profile)

        return company_profile

