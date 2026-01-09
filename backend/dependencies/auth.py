from typing import Optional
from fastapi import Depends, HTTPException, status, Request, Cookie
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models.user import User
from helpers.security import decode_access_token


# токен берётся из заголовка Authorization: Bearer <token>
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
optional_oauth2_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    # Проверяем и декодируем токен
    token_data = decode_access_token(token)
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    # Достаём user_id из поля sub
    user_id = token_data.sub

    # Ищем пользователя в базе
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(optional_oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """
    Опциональная аутентификация - возвращает пользователя если токен валидный,
    иначе None (без ошибки)
    """
    if not credentials:
        return None
    
    # Проверяем и декодируем токен
    token_data = decode_access_token(credentials.credentials)
    if token_data is None:
        return None

    # Достаём user_id из поля sub
    user_id = token_data.sub

    # Ищем пользователя в базе
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalars().first()

    return user


async def get_user_from_cookie(
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """
    Получает пользователя из cookie access_token.
    Используется для серверного рендеринга страниц.
    """
    token = request.cookies.get("access_token")
    if not token:
        return None

    # Проверяем и декодируем токен
    token_data = decode_access_token(token)
    if token_data is None:
        return None

    # Достаём user_id из поля sub
    user_id = token_data.sub

    # Ищем пользователя в базе
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalars().first()

    return user
