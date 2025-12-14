"""
Сервис для обработки заявок на подтверждение компании
"""
import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models.company_claim import CompanyClaim, ClaimStatus
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
        document: UploadFile
    ) -> CompanyClaim:
        """
        Создание новой заявки на подтверждение компании
        
        Args:
            data: Данные формы
            document: Загруженный документ
            
        Returns:
            CompanyClaim: Созданная заявка
        """
        document_path, document_name = await self.save_file(document)
        claim = CompanyClaim(
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

