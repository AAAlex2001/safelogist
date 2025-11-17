from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.schemas.registration import UserRegistration, UserResponse
from backend.services.registration import UserService


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse)
async def register_user(
    data: UserRegistration,
    db: AsyncSession = Depends(get_db),
):
    service = UserService(db)
    user = await service.create_user(data)
    return user
