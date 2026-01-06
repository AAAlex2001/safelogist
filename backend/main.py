"""
Главный файл FastAPI приложения
"""
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from routes import registration, login, forgot_password, profile, openapi, legat, offdata, reviews_pages, seo, admin, company_claim, review_request, landing
import time

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

# Middleware для логирования реальных IP
@app.middleware("http")
async def log_requests(request: Request, call_next):
    # Получаем реальный IP из заголовков (если есть прокси)
    real_ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
    if "," in real_ip:  # Если несколько IP через запятую
        real_ip = real_ip.split(",")[0].strip()

    user_agent = request.headers.get("user-agent", "-")
    # защитимся от log injection и переносов строк
    user_agent = user_agent.replace("\r", " ").replace("\n", " ").strip() or "-"
    
    # Логируем только не-статические запросы
    if not request.url.path.startswith("/static") and not request.url.path.startswith("/uploads"):
        print(f"[{real_ip}] {request.method} {request.url.path} ua=\"{user_agent}\"")
    
    response = await call_next(request)
    return response

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
app.include_router(company_claim.router)
app.include_router(review_request.router)
app.include_router(admin.router)
app.include_router(landing.router)


@app.get("/")
async def root():
    """Корневой эндпоинт"""
    return {"message": "SafeLogist API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """Проверка здоровья приложения"""
    return {"status": "ok"}

