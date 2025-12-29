from typing import List, Optional

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from dependencies.auth import get_current_user
from models.user import User
from schemas.review_request import ReviewRequestResponse, ReviewRequestListItem
from services.review_request_service import ReviewRequestService


router = APIRouter(prefix="/api/review-request", tags=["review_request"])


@router.post("", response_model=ReviewRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_review_request(
    target_company: str = Form(..., description="Компания, о которой отзыв"),
    rating: int = Form(..., ge=1, le=5, description="Оценка от 1 до 5"),
    comment: str = Form(..., min_length=10, description="Текст отзыва"),
    attachment: Optional[UploadFile] = File(None, description="Прикрепленный файл (PDF, JPG, PNG)"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ReviewRequestService(db)
    
    review_request = await service.create_request(
        user=current_user,
        target_company=target_company,
        rating=rating,
        comment=comment,
        attachment=attachment
    )
    
    return ReviewRequestResponse(
        id=review_request.id,
        from_company=review_request.from_company,
        target_company=review_request.target_company,
        rating=review_request.rating,
        status=review_request.status.value,
        created_at=review_request.created_at
    )


@router.get("/my")
async def get_my_review_requests(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    request_status: Optional[str] = Query(None, alias="status", description="Фильтр: PENDING, APPROVED, REJECTED"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ReviewRequestService(db)
    review_list, total = await service.get_user_requests(current_user.id, request_status, page, per_page)
    
    total_pages = (total + per_page - 1) // per_page
    
    return {
        "reviews": [
            {
                "id": r.id,
                "user_id": r.user_id,
                "from_company": r.from_company,
                "target_company": r.target_company,
                "rating": r.rating,
                "comment": r.comment,
                "attachment_path": r.attachment_path,
                "attachment_name": r.attachment_name,
                "status": r.status.value,
                "admin_comment": r.admin_comment,
                "created_at": r.created_at.isoformat() if r.created_at else None,
                "updated_at": r.updated_at.isoformat() if r.updated_at else None
            }
            for r in review_list
        ],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages
    }


@router.get("", response_model=List[ReviewRequestListItem])
async def list_review_requests(
    request_status: Optional[str] = Query(None, alias="status", description="Фильтр: PENDING, APPROVED, REJECTED"),
    db: AsyncSession = Depends(get_db)
):
    service = ReviewRequestService(db)
    requests = await service.get_all_requests(request_status)
    
    return [
        ReviewRequestListItem(
            id=r.id,
            user_id=r.user_id,
            from_company=r.from_company,
            target_company=r.target_company,
            rating=r.rating,
            comment=r.comment,
            attachment_path=r.attachment_path,
            attachment_name=r.attachment_name,
            status=r.status.value,
            admin_comment=r.admin_comment,
            created_at=r.created_at,
            updated_at=r.updated_at
        )
        for r in requests
    ]


@router.get("/{request_id}", response_model=ReviewRequestListItem)
async def get_review_request(
    request_id: int,
    db: AsyncSession = Depends(get_db)
):
    service = ReviewRequestService(db)
    review_request = await service.get_request_by_id(request_id)
    
    if not review_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заявка не найдена"
        )
    
    return ReviewRequestListItem(
        id=review_request.id,
        user_id=review_request.user_id,
        from_company=review_request.from_company,
        target_company=review_request.target_company,
        rating=review_request.rating,
        comment=review_request.comment,
        attachment_path=review_request.attachment_path,
        attachment_name=review_request.attachment_name,
        status=review_request.status.value,
        admin_comment=review_request.admin_comment,
        created_at=review_request.created_at,
        updated_at=review_request.updated_at
    )


@router.post("/{request_id}/approve")
async def approve_review_request(
    request_id: int,
    admin_comment: Optional[str] = Form(None, description="Комментарий администратора"),
    db: AsyncSession = Depends(get_db)
):
    service = ReviewRequestService(db)
    review = await service.approve_request(request_id, admin_comment)
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заявка не найдена"
        )
    
    return {"message": "Отзыв одобрен и опубликован", "review_id": review.id}


@router.post("/{request_id}/reject")
async def reject_review_request(
    request_id: int,
    admin_comment: Optional[str] = Form(None, description="Причина отклонения"),
    db: AsyncSession = Depends(get_db)
):
    service = ReviewRequestService(db)
    success = await service.reject_request(request_id, admin_comment)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заявка не найдена"
        )
    
    return {"message": "Заявка отклонена"}


@router.delete("/{request_id}")
async def delete_review_request(
    request_id: int,
    db: AsyncSession = Depends(get_db)
):
    service = ReviewRequestService(db)
    success = await service.delete_request(request_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заявка не найдена"
        )
    
    return {"message": "Заявка удалена"}
