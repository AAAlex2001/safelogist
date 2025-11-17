from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.schemas.login import LoginRequest, LoginResponse
from backend.services.login import LoginService
from backend.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
async def login(
    data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    service = LoginService(db)
    user = await service.login(data)

    token = create_access_token({"sub": str(user.id)})

    return LoginResponse(access_token=token)
