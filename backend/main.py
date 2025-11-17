"""
Главный файл FastAPI приложения
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import registration, login, forgot_password

# Создание приложения FastAPI
app = FastAPI(
    title="SafeLogist API",
    description="API для системы логистики",
    version="1.0.0"
)

# Настройка CORS (разрешить запросы с фронтенда)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене укажите конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(registration.router)
app.include_router(login.router)
app.include_router(forgot_password.router)


@app.get("/")
async def root():
    """Корневой эндпоинт"""
    return {"message": "SafeLogist API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """Проверка здоровья приложения"""
    return {"status": "ok"}

