"""
Роуты для серверного рендеринга страниц с отзывами
"""
import os
import logging
from urllib.parse import quote, unquote
from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from services.reviews_service import ReviewsService
from helpers.translations import (
    SUPPORTED_LANGS, DEFAULT_LANG,
    normalize_lang, get_translations
)

# Настройка логирования
logger = logging.getLogger(__name__)

router = APIRouter(tags=["reviews_pages"])
templates = Jinja2Templates(directory="templates")

# Константы для защиты от парсинга
MAX_PAGES_FOR_USERS = 100  # Максимальное количество страниц для обычных пользователей

# User agents поисковых ботов
SEARCH_ENGINE_BOTS = [
    # Google
    'Googlebot',
    'Googlebot-Image',
    'Googlebot-News',
    'Googlebot-Video',
    'Google-InspectionTool',
    'APIs-Google',
    'Mediapartners-Google',
    'AdsBot-Google',
    'Google-Extended',  # Google AI training
    # Bing / Microsoft
    'bingbot',
    'BingPreview',
    'msnbot',
    # Yahoo
    'Slurp',
    # DuckDuckGo
    'DuckDuckBot',
    # Yandex
    'YandexBot',
    'YandexAccessibilityBot',
    'YandexImages',
    'YandexMobileBot',
    # Baidu
    'Baiduspider',
    # Social Media
    'facebookexternalhit',
    'Twitterbot',
    'LinkedInBot',
    'Pinterestbot',
    'TelegramBot',
    'WhatsApp',
    'Slackbot',
    'Discordbot',
    # Apple
    'applebot',
    'Applebot',
    # Other search engines
    'Sogou',
    'Exabot',
    'ia_archiver',  # Alexa
    'archive.org_bot',
    'PetalBot',  # Huawei
    'SemrushBot',
    'AhrefsBot',
    'MJ12bot',  # Majestic
    'DotBot',
    # AI / LLM crawlers
    'GPTBot',           # OpenAI ChatGPT
    'ChatGPT-User',     # OpenAI ChatGPT browsing
    'OAI-SearchBot',    # OpenAI search
    'ClaudeBot',        # Anthropic Claude
    'Claude-Web',       # Anthropic Claude
    'anthropic-ai',     # Anthropic
    'PerplexityBot',    # Perplexity AI
    'Bytespider',       # ByteDance / TikTok
    'CCBot',            # Common Crawl (used for AI training)
    'cohere-ai',        # Cohere AI
]


def is_search_bot(request: Request) -> bool:
    """Проверяет, является ли запрос от поискового бота"""
    user_agent = request.headers.get('user-agent', '').lower()
    return any(bot.lower() in user_agent for bot in SEARCH_ENGINE_BOTS)


# === Вспомогательные функции для SEO ===

def build_base_url(request: Request) -> str:
    base = os.getenv("BASE_URL", str(request.base_url)).rstrip("/")
    if base.startswith("http://"):
        base = "https://" + base.removeprefix("http://")
    return base


def build_alt_links(request: Request, path_without_lang: str, query: str):
    query_part = f"?{query}" if query else ""
    base = build_base_url(request)
    links = [
        {"hreflang": code, "href": f"{base}/{code}{path_without_lang}{query_part}"}
        for code in SUPPORTED_LANGS
    ]
    links.append({"hreflang": "x-default", "href": f"{base}/{DEFAULT_LANG}{path_without_lang}{query_part}"})
    return links


def extract_path_without_lang(request: Request) -> str:
    path = request.url.path.lstrip("/")
    parts = path.split("/", 1)
    tail = parts[1] if parts and parts[0] in SUPPORTED_LANGS and len(parts) > 1 else path
    return f"/{tail}" if tail else "/"


def build_seo_context(request: Request, lang_code: str) -> dict:
    """Строит SEO контекст для шаблона"""
    base_url = build_base_url(request)
    path_without_lang = extract_path_without_lang(request)
    query_part = request.url.query
    hreflangs = build_alt_links(request, path_without_lang, query_part)
    canonical = f"{base_url}/{lang_code}{path_without_lang}"
    if query_part:
        canonical = f"{canonical}?{query_part}"
    return {
        "base_url": base_url,
        "canonical": canonical,
        "hreflangs": hreflangs,
    }


# === Роуты ===

@router.get("/reviews", response_class=RedirectResponse, status_code=302)
async def reviews_root_redirect():
    return RedirectResponse(url=f"/{DEFAULT_LANG}/reviews", status_code=302)


@router.get("/{lang}/reviews", response_class=HTMLResponse)
async def reviews_list_page(
    request: Request,
    lang: str,
    page: int = Query(1, ge=1),
    db: AsyncSession = Depends(get_db)
):
    lang_code = normalize_lang(lang)
    
    # Защита от парсинга: ограничиваем обычных пользователей
    if not is_search_bot(request) and page > MAX_PAGES_FOR_USERS:
        user_agent = request.headers.get('user-agent', 'Unknown')
        client_ip = request.client.host if request.client else 'Unknown'
        logger.warning(
            f"Anti-parsing: Blocked access to page {page} | "
            f"IP: {client_ip} | User-Agent: {user_agent}"
        )
        return HTMLResponse(
            content=f"""<!DOCTYPE html>
            <html lang="{lang_code}">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Страница недоступна</title>
            </head>
            <body style="font-family: 'Montserrat', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <a href="/{lang_code}/reviews" style="color: #007bff; text-decoration: none;">← Назад к списку</a>
            <h1>Страница недоступна</h1>
            <p>Для просмотра большего количества компаний воспользуйтесь поиском.</p>
            </body></html>""",
            status_code=403
        )
    
    service = ReviewsService(db)

    companies, has_next = await service.get_companies_page(page)
    companies_data = [c.model_dump() for c in companies]

    seo = build_seo_context(request, lang_code)

    return templates.TemplateResponse(
        "reviews_list.html",
        {
            "request": request,
            "reports": companies_data,
            "current_page": page,
            "total_pages": None,
            "total_companies": None,
            "has_next": has_next,
            "lang": lang_code,
            "t": get_translations(lang_code),
            **seo,
        }
    )


@router.get("/api/reviews/search", response_class=JSONResponse)
async def reviews_search_api(
    q: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    search_term = q.strip()
    if not search_term:
        return JSONResponse(content={"companies": []})

    service = ReviewsService(db)
    companies = await service.search_companies(search_term, limit)

    return JSONResponse(content={
        "companies": [{"name": c.name, "id": c.id} for c in companies]
    })


@router.get("/reviews/search", response_class=RedirectResponse, status_code=302)
async def reviews_search_redirect(q: str = Query(..., min_length=1)):
    return RedirectResponse(url=f"/{DEFAULT_LANG}/reviews/search?q={quote(q, safe='')}", status_code=302)


@router.get("/{lang}/reviews/search", response_class=HTMLResponse)
async def reviews_search_page(
    request: Request,
    lang: str,
    q: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db)
):
    lang_code = normalize_lang(lang)
    service = ReviewsService(db)

    companies = await service.search_companies_with_stats(q.strip())
    reports_data = [c.model_dump() for c in companies]

    seo = build_seo_context(request, lang_code)

    return templates.TemplateResponse(
        "reviews_list.html",
        {
            "request": request,
            "reports": reports_data,
            "current_page": 1,
            "total_pages": 1,
            "total_companies": len(reports_data),
            "search_query": q,
            "lang": lang_code,
            "t": get_translations(lang_code),
            **seo,
        }
    )


@router.get("/reviews/{company_slug:path}", response_class=RedirectResponse, status_code=302)
async def company_reviews_redirect(
    company_slug: str,
    page: int = Query(1, ge=1),
    db: AsyncSession = Depends(get_db)
):
    company_name = unquote(company_slug)
    service = ReviewsService(db)

    company_id = await service.get_min_review_id_for_company(company_name)
    if not company_id:
        return RedirectResponse(url=f"/{DEFAULT_LANG}/reviews", status_code=302)
    return RedirectResponse(url=f"/{DEFAULT_LANG}/reviews/item/{company_id}?page={page}", status_code=302)


@router.get("/{lang}/reviews/item/{company_id:int}", response_class=HTMLResponse)
async def company_reviews_page(
    request: Request,
    lang: str,
    company_id: int,
    page: int = Query(1, ge=1),
    db: AsyncSession = Depends(get_db)
):
    lang_code = normalize_lang(lang)
    t = get_translations(lang_code)
    seo = build_seo_context(request, lang_code)
    
    # Защита от парсинга: ограничиваем обычных пользователей
    if not is_search_bot(request) and page > MAX_PAGES_FOR_USERS:
        user_agent = request.headers.get('user-agent', 'Unknown')
        client_ip = request.client.host if request.client else 'Unknown'
        logger.warning(
            f"Anti-parsing: Blocked reviews page {page} for company {company_id} | "
            f"IP: {client_ip} | User-Agent: {user_agent}"
        )
        return HTMLResponse(
            content=f"""<!DOCTYPE html>
            <html lang="{lang_code}">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Страница недоступна</title>
                <link rel="canonical" href="{seo['canonical']}">
            </head>
            <body style="font-family: 'Montserrat', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <a href="/{lang_code}/reviews" style="color: #007bff; text-decoration: none;">← {t.get("back_to_list")}</a>
            <h1>Страница недоступна</h1>
            <p>Для просмотра большего количества отзывов воспользуйтесь поиском.</p>
            </body></html>""",
            status_code=403
        )
    
    service = ReviewsService(db)
    per_page = 10

    # Получаем название компании
    company_name = await service.get_company_name_by_review_id(company_id)
    if not company_name:
        return HTMLResponse(
            content=f"""<!DOCTYPE html>
            <html lang="{lang_code}">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>404</title>
                <link rel="canonical" href="{seo['canonical']}">
                {''.join([f'<link rel="alternate" hreflang="{h["hreflang"]}" href="{h["href"]}">' for h in seo['hreflangs']])}
            </head>
            <body style="font-family: 'Montserrat', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <a href="/{lang_code}/reviews" style="color: #007bff; text-decoration: none;">{t.get("back_to_list")}</a>
            <h1>{t.get("not_found")}</h1></body></html>""",
            status_code=404
        )

    # Получаем данные
    total_reviews = await service.get_company_reviews_count(company_name)
    reviews = await service.get_company_reviews(company_name, page, per_page)
    
    # Проверяем, занята ли компания (есть ли владелец) и получаем данные владельца
    from models.company import Company
    from models.user import User
    from sqlalchemy import select as sql_select
    company_query = sql_select(Company).where(Company.name == company_name)
    company_result = await db.execute(company_query)
    company = company_result.scalars().first()
    is_claimed = company and company.owner_user_id is not None
    
    # Получаем данные владельца компании
    owner_data = None
    if is_claimed and company.owner_user_id:
        owner_query = sql_select(User).where(User.id == company.owner_user_id)
        owner_result = await db.execute(owner_query)
        owner = owner_result.scalars().first()
        if owner:
            # Используем данные из company (приоритет), если нет - из user
            photo_path = company.logo if company.logo else owner.photo
            owner_data = {
                "name": company.contact_person if company.contact_person else owner.name,
                "position": owner.position,
                "email": company.contact_email if company.contact_email else owner.email,
                "phone": company.contact_phone if company.contact_phone else owner.phone,
                "photo": f"/static/user_photos/{photo_path}" if photo_path else None,
            }
            print(f"✅ Owner data loaded: {owner_data}")

    total_pages = (total_reviews + per_page - 1) // per_page
    display_name = reviews[0].subject if reviews else company_name

    # Мета-теги
    meta_title = t.get("meta_title", "{name}").format(name=display_name, page=page, total_reviews=total_reviews)
    meta_desc = t.get("meta_desc", "").format(name=display_name, page=page, total_reviews=total_reviews)

    # Получаем ID reviewer'ов
    reviewer_names = [r.reviewer for r in reviews if r.reviewer and r.reviewer.strip()]
    reviewer_id_map = await service.get_reviewer_ids(reviewer_names) if reviewer_names else {}

    # Формируем данные отзывов
    review_items = []
    structured_reviews = []

    for review in reviews:
        comment = (review.comment or "").strip()
        if not comment:
            continue
        reviewer_name = review.reviewer or "—"
        reviewer_id = reviewer_id_map.get(reviewer_name) if reviewer_name != "—" else None
        rating_value = review.rating if review.rating is not None else 5

        review_items.append({
            "comment": comment,
            "reviewer": reviewer_name,
            "reviewer_id": reviewer_id,
            "source": getattr(review, "source", None) or "—",
            "rating": rating_value,
            "date": review.review_date.strftime("%d.%m.%Y") if review.review_date else "—",
        })
        structured_reviews.append({
            "@type": "Review",
            "author": reviewer_name,
            "datePublished": review.review_date.isoformat() if review.review_date else None,
            "reviewBody": comment,
            "name": review.subject or display_name,
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": rating_value,
                "bestRating": 5,
                "worstRating": 1
            }
        })

    # Секции с информацией о компании
    company_sections = []
    company_jsonld = {}

    if reviews:
        first = reviews[0]
        v = lambda val: "—" if val is None or (isinstance(val, str) and not val.strip()) else val

        company_sections = [
            {
                "title": t.get("section_main", "Основная информация"),
                "rows": [
                    {"label": t.get("label_full_name"), "value": v(first.subject)},
                    {"label": t.get("label_short_name"), "value": v(getattr(first, "short_name", None))},
                    {"label": t.get("label_country"), "value": v(getattr(first, "jurisdiction", None) or getattr(first, "country", None))},
                    {"label": t.get("label_status_company"), "value": v(getattr(first, "status", None))},
                    {"label": t.get("label_legal_form"), "value": v(getattr(first, "legal_form", None))},
                ]
            },
            {
                "title": t.get("section_registration", "Регистрация"),
                "rows": [
                    {"label": t.get("label_registration_number"), "value": v(getattr(first, "registration_number", None) or getattr(first, "company_number", None))},
                    {"label": t.get("label_tax_number"), "value": v(getattr(first, "inn", None))},
                    {"label": t.get("label_registration_date"), "value": v(getattr(first, "registration_date", None))},
                ]
            },
            {
                "title": t.get("section_activity", "Деятельность"),
                "rows": [
                    {"label": t.get("label_company_category"), "value": v(getattr(first, "subtype", None))},
                    {"label": t.get("label_activity_type"), "value": v(getattr(first, "activity_type", None))},
                ]
            },
            {
                "title": t.get("section_addresses", "Адреса"),
                "rows": [
                    {"label": t.get("label_legal_address"), "value": v(getattr(first, "legal_address", None))},
                    {"label": t.get("label_postal_address"), "value": v(getattr(first, "mailing_address", None))},
                ]
            },
        ]
        
        # Добавляем контакты владельца сразу после адресов (если есть)
        if owner_data:
            contact_rows = []
            if owner_data.get("name"):
                contact_rows.append({"label": "Контактное лицо", "value": owner_data["name"]})
            if owner_data.get("position"):
                contact_rows.append({"label": "Должность", "value": owner_data["position"]})
            if owner_data.get("email"):
                contact_rows.append({"label": "Email", "value": owner_data["email"]})
            if owner_data.get("phone"):
                contact_rows.append({"label": "Телефон", "value": owner_data["phone"]})
            
            if contact_rows:
                company_sections.append({
                    "title": "Контактная информация",
                    "rows": contact_rows
                })
        
        # Продолжаем с остальными секциями
        company_sections.extend([
            {
                "title": t.get("section_capital", "Капитал"),
                "rows": [
                    {"label": t.get("label_authorized_capital"), "value": v(getattr(first, "authorized_capital", None))},
                    {"label": t.get("label_paid_capital"), "value": v(getattr(first, "paid_up_capital", None))},
                ]
            },
            {
                "title": t.get("section_management", "Руководство и учредители"),
                "rows": [
                    {"label": t.get("label_manager"), "value": v(getattr(first, "managers", None))},
                    {"label": t.get("label_founder"), "value": v(getattr(first, "branch", None))},
                ]
            },
            {
                "title": t.get("section_existence", "Статус существования"),
                "rows": [
                    {"label": t.get("label_status"), "value": v(getattr(first, "status", None))},
                    {"label": t.get("label_liquidation_date"), "value": v(getattr(first, "liquidation_date", None))},
                ]
            },
        ])

        # JSON-LD
        avg_rating = None
        if structured_reviews:
            ratings = [r["reviewRating"]["ratingValue"] for r in structured_reviews if r["reviewRating"]["ratingValue"] is not None]
            if ratings:
                avg_rating = sum(ratings) / len(ratings)

        company_jsonld = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": display_name,
            "url": seo['canonical'],
            "identifier": getattr(first, "id", None),
            "address": {
                "@type": "PostalAddress",
                "streetAddress": getattr(first, "legal_address", None) or "—",
                "addressCountry": getattr(first, "jurisdiction", None) or getattr(first, "country", None) or "—",
            },
            "foundingDate": getattr(first, "registration_date", None),
            "legalName": getattr(first, "short_name", None) or display_name,
            "sameAs": getattr(first, "link", None) if hasattr(first, "link") else None,
        }
        if avg_rating is not None:
            company_jsonld["aggregateRating"] = {
                "@type": "AggregateRating",
                "ratingValue": round(avg_rating, 2),
                "reviewCount": total_reviews,
            }
        if structured_reviews:
            company_jsonld["review"] = structured_reviews

    return templates.TemplateResponse(
        "company_reviews.html",
        {
            "request": request,
            "lang": lang_code,
            "t": t,
            "display_name": display_name,
            "total_reviews": total_reviews,
            "page": page,
            "total_pages": total_pages,
            "reviews": review_items,
            "company_id": company_id,
            "company_jsonld": company_jsonld,
            "company_sections": company_sections,
            "meta_title": meta_title,
            "meta_desc": meta_desc,
            "og_url": seo['canonical'],
            "og_image": f"{seo['base_url']}/static/safelogist_1.png",
            "is_claimed": is_claimed,
            "owner_data": owner_data,  # Данные владельца
            "is_search_bot": is_search_bot(request),  # Для показа полных отзывов ботам
            **seo,
        }
    )
