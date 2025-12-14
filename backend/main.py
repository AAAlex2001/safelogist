"""
Главный файл FastAPI приложения
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware

from routes import registration, login, forgot_password, profile, openapi, legat, offdata, reviews_pages, seo, company_claims, admin
from routes import registration, login, forgot_password, profile, openapi, legat, offdata, reviews_pages, seo, company_claim
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

# Подключение статических файлов
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/sitemaps", StaticFiles(directory="static/sitemaps"), name="sitemaps")

# Подключение роутеров
app.include_router(registration.router)
app.include_router(login.router)
app.include_router(forgot_password.router)
app.include_router(profile.router)
app.include_router(openapi.router)
app.include_router(legat.router)
app.include_router(offdata.router)
app.include_router(reviews_pages.router)
app.include_router(seo.router)
app.include_router(company_claims.router)
app.include_router(admin.router)
app.include_router(company_claim.router)

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

