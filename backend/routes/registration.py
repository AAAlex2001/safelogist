from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.registration import UserRegistration, UserResponse
from services.registration import RegistrationService


router = APIRouter(prefix="/register", tags=["auth"])


@router.post("/register", response_model=UserResponse)
async def register_user(
    data: UserRegistration,
    db: AsyncSession = Depends(get_db),
):
    service = RegistrationService(db)
    user = await service.create_user(data)
    return user
