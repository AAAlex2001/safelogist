"""
Роуты для серверного рендеринга страниц с отзывами
"""
import os
from urllib.parse import quote, unquote
from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional

from database import get_db
from models.review import Review
from models.company import Company

router = APIRouter(tags=["reviews_pages"])

# Настройка Jinja2
templates = Jinja2Templates(directory="templates")
SUPPORTED_LANGS = ["ru", "en", "uk", "ro"]
DEFAULT_LANG = "ru"
TRANSLATIONS = {
    "ru": {
        "list_title": "Все отзывы компаний",
        "list_subtitle": "Честные мнения партнёров и подрядчиков — обновляются ежедневно",
        "search_placeholder": "Название компании или имя лица",
        "search_button": "Поиск",
        "page_label": "Страница",
        "back_to_list": "← Назад к списку",
        "not_found": "Компания не найдена",
        "total_reviews": "Всего отзывов",
        "empty_results": "Ничего не найдено",
        "meta_title": "{name} — отзывы (страница {page})",
        "meta_desc": "Отзывы о компании {name}. Всего: {total_reviews}. Страница {page}.",
        "source_label": "Источник",
        "from_label": "От:",
    },
    "en": {
        "list_title": "All company reviews",
        "list_subtitle": "Honest feedback from partners and contractors — updated daily",
        "search_placeholder": "Company name or person",
        "search_button": "Search",
        "page_label": "Page",
        "back_to_list": "← Back to list",
        "not_found": "Company not found",
        "total_reviews": "Total reviews",
        "empty_results": "No results",
        "meta_title": "{name} — reviews (page {page})",
        "meta_desc": "Reviews about {name}. Total: {total_reviews}. Page {page}.",
        "source_label": "Source",
        "from_label": "From:",
    },
    "uk": {
        "list_title": "Усі відгуки компаній",
        "list_subtitle": "Чесні думки партнерів і підрядників — оновлюється щодня",
        "search_placeholder": "Назва компанії або ім'я особи",
        "search_button": "Пошук",
        "page_label": "Сторінка",
        "back_to_list": "← Назад до списку",
        "not_found": "Компанію не знайдено",
        "total_reviews": "Всього відгуків",
        "empty_results": "Нічого не знайдено",
        "meta_title": "{name} — відгуки (сторінка {page})",
        "meta_desc": "Відгуки про компанію {name}. Всього: {total_reviews}. Сторінка {page}.",
        "source_label": "Джерело",
        "from_label": "Від:",
    },
    "ro": {
        "list_title": "Toate recenziile companiilor",
        "list_subtitle": "Opinii sincere de la parteneri și contractori — actualizate zilnic",
        "search_placeholder": "Numele companiei sau al persoanei",
        "search_button": "Căutare",
        "page_label": "Pagina",
        "back_to_list": "← Înapoi la listă",
        "not_found": "Compania nu a fost găsită",
        "total_reviews": "Total recenzii",
        "empty_results": "Niciun rezultat",
        "meta_title": "{name} — recenzii (pagina {page})",
        "meta_desc": "Recenzii despre {name}. Total: {total_reviews}. Pagina {page}.",
        "source_label": "Sursă",
        "from_label": "De la:",
    },
}


def normalize_lang(lang: str) -> str:
    lang_code = (lang or "").lower()
    return lang_code if lang_code in SUPPORTED_LANGS else DEFAULT_LANG


def build_base_url(request: Request) -> str:
    base = os.getenv("BASE_URL", str(request.base_url)).rstrip("/")
    if base.startswith("http://"):
        base = "https://" + base.removeprefix("http://")
    return base


def build_alt_links(request: Request, path_without_lang: str, query: str):
    query_part = f"?{query}" if query else ""
    links = []
    base = build_base_url(request)
    for code in SUPPORTED_LANGS:
        href = f"{base}/{code}{path_without_lang}{query_part}"
        links.append({"hreflang": code, "href": href})
    links.append({"hreflang": "x-default", "href": f"{base}/{DEFAULT_LANG}{path_without_lang}{query_part}"})
    return links


def extract_path_without_lang(request: Request) -> str:
    path = request.url.path.lstrip("/")
    parts = path.split("/", 1)
    tail = parts[1] if parts and parts[0] in SUPPORTED_LANGS and len(parts) > 1 else path
    return f"/{tail}" if tail else "/"


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
    per_page = 10
    offset = (page - 1) * per_page

    query = (
        select(
            Review.subject,
            func.count(Review.id).label('reviews_count')
        )
        .group_by(Review.subject)
        .order_by(Review.subject)
        .limit(per_page)
        .offset(offset)
    )

    result = await db.execute(query)
    rows = result.all()

    companies_data = [
        {
            'company_name': row.subject,
            'company_slug': quote(row.subject, safe=''),
            'reviews_count': row.reviews_count
        }
        for row in rows
    ]

    has_next = len(companies_data) == per_page
    base_url = build_base_url(request)
    path_without_lang = extract_path_without_lang(request)
    query_part = request.url.query
    hreflangs = build_alt_links(request, path_without_lang, query_part)
    canonical = f"{base_url}/{lang_code}{path_without_lang}"
    if query_part:
        canonical = f"{canonical}?{query_part}"

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
            "t": TRANSLATIONS.get(lang_code, TRANSLATIONS[DEFAULT_LANG]),
            "canonical": canonical,
            "hreflangs": hreflangs,
            "base_url": base_url,
        }
    )


@router.get("/api/reviews/search", response_class=JSONResponse)
async def reviews_search_api(
    q: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    search_term = q.strip().lower()
    if not search_term:
        return JSONResponse(content={"companies": []})

    pattern = f'%{search_term}%'

    query = (
        select(Company.name)
        .where(func.lower(Company.name).like(pattern))
        .order_by(Company.name)
        .limit(limit)
    )

    result = await db.execute(query)
    companies = result.scalars().all()

    return JSONResponse(content={
        "companies": [
            {"name": company, "slug": quote(company, safe='')}
            for company in companies
        ]
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
    search_term = q.strip().lower()
    pattern = f'%{search_term}%'

    company_query = (
        select(Company.name)
        .where(func.lower(Company.name).like(pattern))
        .order_by(Company.name)
        .limit(50)
    )
    result = await db.execute(company_query)
    company_names = result.scalars().all()

    reports_data = []
    if company_names:
        count_query = (
            select(
                Review.subject,
                func.count(Review.id).label('reviews_count')
            )
            .where(Review.subject.in_(company_names))
            .group_by(Review.subject)
            .order_by(Review.subject)
        )
        count_result = await db.execute(count_query)

        reports_data = [
            {
                'company_name': row.subject,
                'company_slug': quote(row.subject, safe=''),
                'reviews_count': row.reviews_count
            }
            for row in count_result.all()
        ]

    base_url = build_base_url(request)
    path_without_lang = extract_path_without_lang(request)
    query_part = request.url.query
    hreflangs = build_alt_links(request, path_without_lang, query_part)
    canonical = f"{base_url}/{lang_code}{path_without_lang}"
    if query_part:
        canonical = f"{canonical}?{query_part}"

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
            "t": TRANSLATIONS.get(lang_code, TRANSLATIONS[DEFAULT_LANG]),
            "canonical": canonical,
            "hreflangs": hreflangs,
            "base_url": base_url,
        }
    )


@router.get("/reviews/{company_slug:path}", response_class=RedirectResponse, status_code=302)
async def company_reviews_redirect(company_slug: str, page: int = Query(1, ge=1)):
    slug_encoded = quote(unquote(company_slug), safe="")
    return RedirectResponse(url=f"/{DEFAULT_LANG}/reviews/{slug_encoded}?page={page}", status_code=302)


@router.get("/{lang}/reviews/{company_slug:path}", response_class=HTMLResponse)
async def company_reviews_page(
    request: Request,
    lang: str,
    company_slug: str,
    page: int = Query(1, ge=1),
    db: AsyncSession = Depends(get_db)
):
    lang_code = normalize_lang(lang)
    per_page = 10
    offset = (page - 1) * per_page
    company_name = unquote(company_slug)

    count_query = select(func.count(Review.id)).where(Review.subject == company_name)
    count_result = await db.execute(count_query)
    total_reviews = count_result.scalar() or 0

    if total_reviews > 0:
        search_condition = Review.subject == company_name
    else:
        pattern = f'%{company_name.lower()}%'
        like_query = (
            select(Company.name)
            .where(func.lower(Company.name).like(pattern))
            .limit(1)
        )
        like_result = await db.execute(like_query)
        found = like_result.scalar()

        if not found:
            base_url = build_base_url(request)
            path_without_lang = extract_path_without_lang(request)
            query_part = request.url.query
            hreflangs = build_alt_links(request, path_without_lang, query_part)
            canonical = f"{base_url}/{lang_code}{path_without_lang}"
            if query_part:
                canonical = f"{canonical}?{query_part}"
            t = TRANSLATIONS.get(lang_code, TRANSLATIONS[DEFAULT_LANG])
            return HTMLResponse(
                content=f"""<!DOCTYPE html>
                <html lang="{lang_code}">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>404</title>
                    <link rel="canonical" href="{canonical}">
                    {''.join([f'<link rel="alternate" hreflang="{h["hreflang"]}" href="{h["href"]}">' for h in hreflangs])}
                </head>
                <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                <a href="/{lang_code}/reviews" style="color: #007bff; text-decoration: none;">{t.get("back_to_list")}</a><h1>{t.get("not_found")}</h1></body></html>""",
                status_code=404
            )

        company_name = found
        count_query = select(func.count(Review.id)).where(Review.subject == company_name)
        count_result = await db.execute(count_query)
        total_reviews = count_result.scalar() or 0
        search_condition = Review.subject == company_name

    query = (
        select(Review)
        .where(search_condition)
        .order_by(Review.review_date.desc())
        .limit(per_page)
        .offset(offset)
    )

    result = await db.execute(query)
    reviews = result.scalars().all()

    total_pages = (total_reviews + per_page - 1) // per_page
    display_name = reviews[0].subject if reviews else company_name

    t = TRANSLATIONS.get(lang_code, TRANSLATIONS[DEFAULT_LANG])
    base_url = build_base_url(request)
    path_without_lang = extract_path_without_lang(request)
    query_part = request.url.query
    hreflangs = build_alt_links(request, path_without_lang, query_part)
    canonical = f"{base_url}/{lang_code}{path_without_lang}"
    if query_part:
        canonical = f"{canonical}?{query_part}"
    meta_title = t.get("meta_title", "{name}").format(name=display_name, page=page, total_reviews=total_reviews)
    meta_desc = t.get("meta_desc", "").format(name=display_name, page=page, total_reviews=total_reviews)
    og_url = canonical
    og_image = f"{base_url}/static/safelogist.jpg"

    review_items = []
    for review in reviews:
        comment = (review.comment or "").strip()
        if not comment:
            continue  # если нет текста отзыва — не показываем
        reviewer_name = review.reviewer or "—"
        reviewer_slug = quote(unquote(reviewer_name), safe="") if reviewer_name and reviewer_name != "—" else None
        review_items.append({
            "comment": comment,
            "reviewer": reviewer_name,
            "reviewer_slug": reviewer_slug,
            "source": getattr(review, "source", None) or "—",
            "rating": review.rating if review.rating is not None else 5,
            "date": review.review_date.strftime("%d.%m.%Y") if review.review_date else "—",
        })

    company_sections = []
    if reviews:
        first = reviews[0]

        def v(val):
            if val is None or (isinstance(val, str) and val.strip() == ""):
                return "—"
            return val

        def section(title: str, rows: list):
            company_sections.append({"title": title, "rows": rows})

        section(
            "Основная информация",
            [
                {"label": "Полное наименование", "value": v(first.subject)},
                {"label": "Сокращённое наименование", "value": v(getattr(first, "short_name", None))},
                {"label": "Страна регистрации", "value": v(getattr(first, "jurisdiction", None) or getattr(first, "country", None))},
                {"label": "Статус компании", "value": v(getattr(first, "status", None))},
                {"label": "Организационно-правовая форма", "value": v(getattr(first, "legal_form", None))},
            ],
        )

        section(
            "Регистрация",
            [
                {"label": "Регистрационный номер", "value": v(getattr(first, "registration_number", None) or getattr(first, "company_number", None))},
                {"label": "Налоговый номер", "value": v(getattr(first, "inn", None))},
                {"label": "Дата регистрации", "value": v(getattr(first, "registration_date", None))},
            ],
        )

        section(
            "Деятельность",
            [
                {"label": "Категория компании", "value": v(getattr(first, "subtype", None))},
                {"label": "Вид деятельности", "value": v(getattr(first, "activity_type", None))},
            ],
        )

        section(
            "Адреса",
            [
                {"label": "Юридический адрес", "value": v(getattr(first, "legal_address", None))},
                {"label": "Почтовый адрес", "value": v(getattr(first, "mailing_address", None))},
            ],
        )

        section(
            "Капитал",
            [
                {"label": "Уставный капитал", "value": v(getattr(first, "authorized_capital", None))},
                {"label": "Оплаченный капитал", "value": v(getattr(first, "paid_up_capital", None))},
            ],
        )

        section(
            "Руководство и учредители",
            [
                {"label": "Руководитель", "value": v(getattr(first, "managers", None))},
                {"label": "Учредитель", "value": v(getattr(first, "branch", None))},
            ],
        )

        section(
            "Статус существования",
            [
                {"label": "Статус", "value": v(getattr(first, "status", None))},
                {"label": "Дата ликвидации", "value": v(getattr(first, "liquidation_date", None))},
            ],
        )

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
        "company_sections": company_sections,
            "canonical": canonical,
            "hreflangs": hreflangs,
            "meta_title": meta_title,
            "meta_desc": meta_desc,
            "og_url": og_url,
            "og_image": og_image,
            "base_url": base_url,
        }
    )