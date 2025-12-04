from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel, ValidationError
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not set")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# ---------------------------------------------------------------
# Pydantic модель данных токена
# ---------------------------------------------------------------
class TokenData(BaseModel):
    sub: int     # ID пользователя
    exp: int     # timestamp для истечения


# ---------------------------------------------------------------
# Создание access токена
# ---------------------------------------------------------------
def create_access_token(user_id: int) -> str:
    """
    Создаёт корректный JWT токен:
    - sub ОБЯЗАТЕЛЬНО строка (требование JOSE)
    - exp ОБЯЗАТЕЛЬНО timestamp (int)
    """

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "sub": str(user_id),
        "exp": int(expire.timestamp()),
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# ---------------------------------------------------------------
# Декодирование access токена
# ---------------------------------------------------------------
def decode_access_token(token: str) -> Optional[TokenData]:
    """
    Декодирует JWT токен.
    Возвращает TokenData(sub:int, exp:int) или None.
    """

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        sub_raw = payload.get("sub")
        user_id = int(sub_raw)

        exp_raw = payload.get("exp")

        token_data = TokenData(
            sub=user_id,
            exp=exp_raw
        )

        return token_data

    except (JWTError, ValidationError, ValueError) as e:
        print(f"Ошибка декодирования токена: {e}")
        return None
