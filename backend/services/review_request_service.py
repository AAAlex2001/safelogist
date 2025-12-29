import os
import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models.review_request import ReviewRequest, ReviewRequestStatus
from models.review import Review
from models.company import Company
from models.user import User


UPLOAD_DIR = "uploads/review_requests"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_MIME_TYPES = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png"
}

MAX_FILE_SIZE = 10 * 1024 * 1024


class ReviewRequestService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def save_file(self, file: UploadFile) -> tuple[str, str]:
        if file.content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Допустимые форматы: PDF, JPG, PNG"
            )
        
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
        
        return filepath, file.filename or "attachment"

    async def create_request(
        self,
        user: User,
        target_company: str,
        rating: int,
        comment: str,
        attachment: Optional[UploadFile] = None
    ) -> ReviewRequest:
        if not user.company_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="У вас не указана компания в профиле"
            )
        
        attachment_path = None
        attachment_name = None
        
        if attachment:
            attachment_path, attachment_name = await self.save_file(attachment)
        
        review_request = ReviewRequest(
            user_id=user.id,
            from_company=user.company_name,
            target_company=target_company,
            rating=rating,
            comment=comment,
            attachment_path=attachment_path,
            attachment_name=attachment_name,
            status=ReviewRequestStatus.PENDING
        )
        
        self.db.add(review_request)
        await self.db.commit()
        await self.db.refresh(review_request)
        
        return review_request

    async def get_request_by_id(self, request_id: int) -> Optional[ReviewRequest]:
        query = select(ReviewRequest).where(ReviewRequest.id == request_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_all_requests(self, status_filter: Optional[str] = None) -> list[ReviewRequest]:
        query = select(ReviewRequest).order_by(ReviewRequest.created_at.desc())
        
        if status_filter:
            try:
                status_enum = ReviewRequestStatus(status_filter.upper())
                query = query.where(ReviewRequest.status == status_enum)
            except ValueError:
                pass
        
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_user_requests(self, user_id: int, status_filter: Optional[str] = None) -> list[ReviewRequest]:
        query = select(ReviewRequest).where(ReviewRequest.user_id == user_id).order_by(ReviewRequest.created_at.desc())
        
        if status_filter:
            try:
                status_enum = ReviewRequestStatus(status_filter.upper())
                query = query.where(ReviewRequest.status == status_enum)
            except ValueError:
                pass
        
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def approve_request(self, request_id: int, admin_comment: Optional[str] = None) -> Optional[Review]:
        review_request = await self.get_request_by_id(request_id)
        if not review_request:
            return None
        
        review_id = f"USER-{review_request.user_id}-{review_request.id}"
        
        review = Review(
            subject=review_request.target_company,
            review_id=review_id,
            comment=review_request.comment,
            reviewer=review_request.from_company,
            rating=review_request.rating,
            status="published",
            review_date=review_request.created_at,
            source="SafeLogist"
        )
        
        self.db.add(review)
        
        review_request.status = ReviewRequestStatus.APPROVED
        review_request.admin_comment = admin_comment
        
        await self.db.commit()
        await self.db.refresh(review)
        
        await self._update_company_stats(review_request.target_company)
        
        return review

    async def reject_request(self, request_id: int, admin_comment: Optional[str] = None) -> bool:
        review_request = await self.get_request_by_id(request_id)
        if not review_request:
            return False
        
        review_request.status = ReviewRequestStatus.REJECTED
        review_request.admin_comment = admin_comment
        
        await self.db.commit()
        return True

    async def _update_company_stats(self, company_name: str) -> None:
        count_query = select(Review.id).where(Review.subject == company_name)
        result = await self.db.execute(count_query)
        reviews = list(result.scalars().all())
        
        reviews_count = len(reviews)
        min_review_id = min(reviews) if reviews else None
        
        company_query = select(Company).where(Company.name == company_name)
        company_result = await self.db.execute(company_query)
        company = company_result.scalars().first()
        
        if company:
            company.reviews_count = reviews_count
            company.min_review_id = min_review_id
        else:
            new_company = Company(
                name=company_name,
                reviews_count=reviews_count,
                min_review_id=min_review_id
            )
            self.db.add(new_company)
        
        await self.db.commit()

    async def delete_request(self, request_id: int) -> bool:
        review_request = await self.get_request_by_id(request_id)
        if not review_request:
            return False
        
        if review_request.attachment_path and os.path.exists(review_request.attachment_path):
            try:
                os.remove(review_request.attachment_path)
            except OSError:
                pass
        
        await self.db.delete(review_request)
        await self.db.commit()
        return True
