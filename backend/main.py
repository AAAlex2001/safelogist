"""Главный файл FastAPI приложения"""

import os

from fastapi import Depends, FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.sessions import SessionMiddleware

from dependencies.auth import get_user_from_cookie
from helpers.translations import DEFAULT_LANG, SUPPORTED_LANGS, get_translations, normalize_lang
from routes import registration, login, forgot_password, profile, openapi, legat, offdata, reviews_pages, seo, admin, company_claim, review_request, landing

# Создание приложения FastAPI
app = FastAPI(
    title="SafeLogist API",
    description="API для системы логистики",
    version="1.0.0"
)

templates = Jinja2Templates(directory="templates")


def wants_html(request: Request) -> bool:
    accept = (request.headers.get("accept") or "").lower()
    if request.url.path.startswith(("/api", "/docs", "/redoc", "/openapi")):
        return False
    return "text/html" in accept


def render_404(request: Request) -> HTMLResponse:
    first = request.url.path.lstrip("/").split("/", 1)[0]
    lang_code = normalize_lang(first) if first in SUPPORTED_LANGS else DEFAULT_LANG
    t = get_translations(lang_code)
    return templates.TemplateResponse(
        "404.html",
        {"request": request, "lang": lang_code, "t": t},
        status_code=404,
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404 and wants_html(request):
        return render_404(request)
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    if wants_html(request):
        return render_404(request)
    return JSONResponse(status_code=422, content={"detail": exc.errors()})

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


@app.get("/{lang}/profile", response_class=HTMLResponse)
@app.get("/{lang}/profile/{path:path}", response_class=HTMLResponse)
@app.get("/{lang}/settings", response_class=HTMLResponse)
@app.get("/{lang}/settings/{path:path}", response_class=HTMLResponse)
@app.get("/{lang}/reviews-profile", response_class=HTMLResponse)
@app.get("/{lang}/reviews-profile/{path:path}", response_class=HTMLResponse)
async def protected_frontend_pages(
    request: Request,
    lang: str,
    user=Depends(get_user_from_cookie),
):
    if user is None:
        return render_404(request)
    return render_404(request)


@app.get("/")
async def root():
    """Корневой эндпоинт"""
    return {"message": "SafeLogist API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """Проверка здоровья приложения"""
    return {"status": "ok"}

