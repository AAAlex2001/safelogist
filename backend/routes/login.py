from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.login import LoginRequest, LoginResponse
from services.login import LoginService
from helpers.security import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
async def login(
    data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    service = LoginService(db)
    user = await service.login(data)

    token = create_access_token(user.id)

    return LoginResponse(access_token=token)
