from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.registration import (
    UserRegistration, 
    UserResponse, 
    EmailCodeRequest, 
    EmailCodeVerify
)
from services.registration import RegistrationService


router = APIRouter(prefix="/register", tags=["auth"])


# ----------------------------------------------------------------------
# 1. Отправка кода верификации на email
# ----------------------------------------------------------------------
@router.post("/send-code")
async def send_verification_code(
    data: EmailCodeRequest,
    db: AsyncSession = Depends(get_db),
):
    service = RegistrationService(db)
    await service.send_verification_code(data.email)
    return {"message": "Код отправлен на почту"}


# ----------------------------------------------------------------------
# 2. Проверка кода верификации
# ----------------------------------------------------------------------
@router.post("/verify-code")
async def verify_code(
    data: EmailCodeVerify,
    db: AsyncSession = Depends(get_db),
):
    service = RegistrationService(db)
    await service.verify_code(data.email, data.code)
    return {"message": "Email подтверждён", "verified": True}


# ----------------------------------------------------------------------
# 3. Регистрация пользователя
# ----------------------------------------------------------------------
@router.post("/", response_model=UserResponse)
async def register_user(
    data: UserRegistration,
    db: AsyncSession = Depends(get_db),
):
    service = RegistrationService(db)
    user = await service.create_user(data)
    return user
