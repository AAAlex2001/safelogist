"""
Главный файл FastAPI приложения
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from routes import registration, login, forgot_password, profile, portugal
from admin import init_admin

# Создание приложения FastAPI
app = FastAPI(
    title="SafeLogist API",
    description="API для системы логистики",
    version="1.0.0"
)

# Настройка сессий (нужно для админ панели)
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY")
)

# Настройка CORS (разрешить запросы с фронтенда)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(registration.router)
app.include_router(login.router)
app.include_router(forgot_password.router)
app.include_router(profile.router)
app.include_router(portugal.router)

# Подключение админ панели
init_admin(app)


@app.get("/")
async def root():
    """Корневой эндпоинт"""
    return {"message": "SafeLogist API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """Проверка здоровья приложения"""
    return {"status": "ok"}

