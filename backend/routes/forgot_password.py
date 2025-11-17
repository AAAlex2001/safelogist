from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from services.forgot_password import PasswordResetService
from schemas.forgot_password import (
    PasswordResetRequest,
    PasswordResetVerify,
    PasswordResetReset,
)

router = APIRouter(prefix="/forgot-password", tags=["auth"])


# ----------------------------------------------------------------------
# 1. Запрос кода по email
# ----------------------------------------------------------------------
@router.post("/request")
async def request_code(
        data: PasswordResetRequest,
        db: AsyncSession = Depends(get_db)
):
    service = PasswordResetService(db)
    await service.request_code(data.email)
    return {"message": "Код отправлен на почту"}


# ----------------------------------------------------------------------
# 2. Проверка кода
# ----------------------------------------------------------------------
@router.post("/verify")
async def verify_code(
        data: PasswordResetVerify,
        db: AsyncSession = Depends(get_db)
):
    service = PasswordResetService(db)
    user_id = await service.verify_code(data.code)
    return {"message": "Код подтверждён", "user_id": user_id}


# ----------------------------------------------------------------------
# 3. Установка нового пароля
# ----------------------------------------------------------------------
@router.post("/reset")
async def reset_password(
        data: PasswordResetReset,
        db: AsyncSession = Depends(get_db)
):
    service = PasswordResetService(db)
    await service.set_new_password(data.user_id, data.new_password)
    return {"message": "Пароль успешно обновлён"}
