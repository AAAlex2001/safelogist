from datetime import datetime, timedelta
from jose import jwt, JWTError

# --------------------------------------------------------------------
# Настройки токена
# --------------------------------------------------------------------
SECRET_KEY = "SUPER_SECRET_KEY_CHANGE_THIS"     # поменять потом
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# --------------------------------------------------------------------
# Создание токена
# --------------------------------------------------------------------
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token


# --------------------------------------------------------------------
# Декодирование и проверка токена
# --------------------------------------------------------------------
def decode_access_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
