"""
Роуты для серверного рендеринга страниц с отзывами
"""
import os
import json
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
        "back_button": "Назад",
        "my_company_button": "Это моя компания",
        "add_review_button": "Добавить отзыв",
        "section_main": "Основная информация",
        "section_registration": "Регистрация",
        "section_activity": "Деятельность",
        "section_addresses": "Адреса",
        "section_capital": "Капитал",
        "section_management": "Руководство и учредители",
        "section_existence": "Статус существования",
        "label_full_name": "Полное наименование",
        "label_short_name": "Сокращённое наименование",
        "label_country": "Страна регистрации",
        "label_status_company": "Статус компании",
        "label_legal_form": "Организационно-правовая форма",
        "label_registration_number": "Регистрационный номер",
        "label_tax_number": "Налоговый номер",
        "label_registration_date": "Дата регистрации",
        "label_company_category": "Категория компании",
        "label_activity_type": "Вид деятельности",
        "label_legal_address": "Юридический адрес",
        "label_postal_address": "Почтовый адрес",
        "label_authorized_capital": "Уставный капитал",
        "label_paid_capital": "Оплаченный капитал",
        "label_manager": "Руководитель",
        "label_founder": "Учредитель",
        "label_status": "Статус",
        "label_liquidation_date": "Дата ликвидации",
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
        "back_button": "Back",
        "my_company_button": "This is my company",
        "add_review_button": "Add review",
        "section_main": "Main info",
        "section_registration": "Registration",
        "section_activity": "Activity",
        "section_addresses": "Addresses",
        "section_capital": "Capital",
        "section_management": "Management and founders",
        "section_existence": "Existence status",
        "label_full_name": "Full name",
        "label_short_name": "Short name",
        "label_country": "Registration country",
        "label_status_company": "Company status",
        "label_legal_form": "Legal form",
        "label_registration_number": "Registration number",
        "label_tax_number": "Tax number",
        "label_registration_date": "Registration date",
        "label_company_category": "Company category",
        "label_activity_type": "Activity type",
        "label_legal_address": "Legal address",
        "label_postal_address": "Postal address",
        "label_authorized_capital": "Authorized capital",
        "label_paid_capital": "Paid-up capital",
        "label_manager": "Manager",
        "label_founder": "Founder",
        "label_status": "Status",
        "label_liquidation_date": "Liquidation date",
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
        "back_button": "Назад",
        "my_company_button": "Це моя компанія",
        "add_review_button": "Додати відгук",
        "section_main": "Основна інформація",
        "section_registration": "Реєстрація",
        "section_activity": "Діяльність",
        "section_addresses": "Адреси",
        "section_capital": "Капітал",
        "section_management": "Керівництво та засновники",
        "section_existence": "Статус існування",
        "label_full_name": "Повне найменування",
        "label_short_name": "Скорочене найменування",
        "label_country": "Країна реєстрації",
        "label_status_company": "Статус компанії",
        "label_legal_form": "Організаційно-правова форма",
        "label_registration_number": "Реєстраційний номер",
        "label_tax_number": "Податковий номер",
        "label_registration_date": "Дата реєстрації",
        "label_company_category": "Категорія компанії",
        "label_activity_type": "Вид діяльності",
        "label_legal_address": "Юридична адреса",
        "label_postal_address": "Поштова адреса",
        "label_authorized_capital": "Статутний капітал",
        "label_paid_capital": "Оплачений капітал",
        "label_manager": "Керівник",
        "label_founder": "Засновник",
        "label_status": "Статус",
        "label_liquidation_date": "Дата ліквідації",
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
        "back_button": "Înapoi",
        "my_company_button": "Aceasta este compania mea",
        "add_review_button": "Adaugă recenzie",
        "section_main": "Informații principale",
        "section_registration": "Înregistrare",
        "section_activity": "Activitate",
        "section_addresses": "Adrese",
        "section_capital": "Capital",
        "section_management": "Conducere și fondatori",
        "section_existence": "Statut de existență",
        "label_full_name": "Denumire completă",
        "label_short_name": "Denumire scurtă",
        "label_country": "Țara de înregistrare",
        "label_status_company": "Statut companie",
        "label_legal_form": "Formă juridică",
        "label_registration_number": "Număr de înregistrare",
        "label_tax_number": "Număr fiscal",
        "label_registration_date": "Data înregistrării",
        "label_company_category": "Categorie companie",
        "label_activity_type": "Tip de activitate",
        "label_legal_address": "Adresă juridică",
        "label_postal_address": "Adresă poștală",
        "label_authorized_capital": "Capital autorizat",
        "label_paid_capital": "Capital vărsat",
        "label_manager": "Conducător",
        "label_founder": "Fondator",
        "label_status": "Statut",
        "label_liquidation_date": "Data lichidării",
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

    # Простой запрос с GROUP BY - PostgreSQL оптимизирует его с индексом на subject
    query = (
        select(
            Review.subject,
            func.count(Review.id).filter(Review.comment.isnot(None)).label('reviews_count'),
            func.min(Review.id).label('company_id'),
        )
        .group_by(Review.subject)
        .order_by(Review.subject)
        .limit(per_page + 1)
        .offset(offset)
    )

    result = await db.execute(query)
    rows = result.all()

    companies_data = [
        {
            'company_name': row.subject,
            'company_slug': quote(row.subject, safe=''),
            'company_id': row.company_id,
            'reviews_count': row.reviews_count
        }
        for row in rows
    ]

    has_next = len(companies_data) > per_page
    if has_next:
        companies_data = companies_data[:per_page]

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
    search_term = q.strip()
    if not search_term:
        return JSONResponse(content={"companies": []})

    pattern = f'%{search_term}%'

    # Используем ILIKE вместо lower().like() - работает с триграммным индексом
    query = (
        select(
            Review.subject,
            func.min(Review.id).label("company_id")
        )
        .where(Review.subject.ilike(pattern))
        .group_by(Review.subject)
        .order_by(Review.subject)
        .limit(limit)
    )

    result = await db.execute(query)
    rows = result.all()

    return JSONResponse(content={
        "companies": [
            {"name": row.subject, "id": row.company_id}
            for row in rows
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
    search_term = q.strip()
    pattern = f'%{search_term}%'

    # Один объединённый запрос вместо двух отдельных
    # Используем ILIKE для работы с триграммным индексом
    query = (
        select(
            Review.subject,
            func.min(Review.id).label("company_id"),
            func.count(Review.id).filter(Review.comment.isnot(None)).label('reviews_count')
        )
        .where(Review.subject.ilike(pattern))
        .group_by(Review.subject)
        .order_by(Review.subject)
        .limit(50)
    )
    result = await db.execute(query)
    rows = result.all()

    reports_data = [
        {
            'company_name': row.subject,
            'company_slug': quote(row.subject, safe=''),
            'company_id': row.company_id,
            'reviews_count': row.reviews_count
        }
        for row in rows
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
async def company_reviews_redirect(company_slug: str, page: int = Query(1, ge=1), db: AsyncSession = Depends(get_db)):
    company_name = unquote(company_slug)
    # Берём минимальный id отзыва для этой компании как стабильный идентификатор
    min_id_query = (
        select(func.min(Review.id))
        .where(Review.subject == company_name)
    )
    result = await db.execute(min_id_query)
    company_id = result.scalar()
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
    per_page = 10
    offset = (page - 1) * per_page

    # Находим имя компании по id отзыва
    company_name_query = select(Review.subject).where(Review.id == company_id)
    company_name_result = await db.execute(company_name_query)
    company_name = company_name_result.scalar()
    if not company_name:
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

    count_query = select(func.count(Review.id)).where(
        Review.subject == company_name,
        Review.comment.isnot(None)  # Считаем только записи с отзывами
    )
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
    structured_reviews = []
    
    # Получаем минимальные ID для всех reviewer в батче
    reviewer_names = [r.reviewer for r in reviews if r.reviewer and r.reviewer.strip()]
    reviewer_id_map = {}
    if reviewer_names:
        reviewer_id_query = (
            select(
                Review.subject,
                func.min(Review.id).label("min_id")
            )
            .where(Review.subject.in_(reviewer_names))
            .group_by(Review.subject)
        )
        reviewer_id_result = await db.execute(reviewer_id_query)
        reviewer_id_map = {row.subject: row.min_id for row in reviewer_id_result.all()}
    
    for review in reviews:
        comment = (review.comment or "").strip()
        if not comment:
            continue  # если нет текста отзыва — не показываем
        reviewer_name = review.reviewer or "—"
        reviewer_id = reviewer_id_map.get(reviewer_name) if reviewer_name and reviewer_name != "—" else None
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

    company_sections = []
    company_jsonld = {}
    if reviews:
        first = reviews[0]

        def v(val):
            if val is None or (isinstance(val, str) and val.strip() == ""):
                return "—"
            return val

        def section(title: str, rows: list):
            company_sections.append({"title": title, "rows": rows})

        section(
            t.get("section_main", "Основная информация"),
            [
                {"label": t.get("label_full_name", "Полное наименование"), "value": v(first.subject)},
                {"label": t.get("label_short_name", "Сокращённое наименование"), "value": v(getattr(first, "short_name", None))},
                {"label": t.get("label_country", "Страна регистрации"), "value": v(getattr(first, "jurisdiction", None) or getattr(first, "country", None))},
                {"label": t.get("label_status_company", "Статус компании"), "value": v(getattr(first, "status", None))},
                {"label": t.get("label_legal_form", "Организационно-правовая форма"), "value": v(getattr(first, "legal_form", None))},
            ],
        )

        section(
            t.get("section_registration", "Регистрация"),
            [
                {"label": t.get("label_registration_number", "Регистрационный номер"), "value": v(getattr(first, "registration_number", None) or getattr(first, "company_number", None))},
                {"label": t.get("label_tax_number", "Налоговый номер"), "value": v(getattr(first, "inn", None))},
                {"label": t.get("label_registration_date", "Дата регистрации"), "value": v(getattr(first, "registration_date", None))},
            ],
        )

        section(
            t.get("section_activity", "Деятельность"),
            [
                {"label": t.get("label_company_category", "Категория компании"), "value": v(getattr(first, "subtype", None))},
                {"label": t.get("label_activity_type", "Вид деятельности"), "value": v(getattr(first, "activity_type", None))},
            ],
        )

        section(
            t.get("section_addresses", "Адреса"),
            [
                {"label": t.get("label_legal_address", "Юридический адрес"), "value": v(getattr(first, "legal_address", None))},
                {"label": t.get("label_postal_address", "Почтовый адрес"), "value": v(getattr(first, "mailing_address", None))},
            ],
        )

        section(
            t.get("section_capital", "Капитал"),
            [
                {"label": t.get("label_authorized_capital", "Уставный капитал"), "value": v(getattr(first, "authorized_capital", None))},
                {"label": t.get("label_paid_capital", "Оплаченный капитал"), "value": v(getattr(first, "paid_up_capital", None))},
            ],
        )

        section(
            t.get("section_management", "Руководство и учредители"),
            [
                {"label": t.get("label_manager", "Руководитель"), "value": v(getattr(first, "managers", None))},
                {"label": t.get("label_founder", "Учредитель"), "value": v(getattr(first, "branch", None))},
            ],
        )

        section(
            t.get("section_existence", "Статус существования"),
            [
                {"label": t.get("label_status", "Статус"), "value": v(getattr(first, "status", None))},
                {"label": t.get("label_liquidation_date", "Дата ликвидации"), "value": v(getattr(first, "liquidation_date", None))},
            ],
        )

        avg_rating = None
        if structured_reviews:
            ratings = [r["reviewRating"]["ratingValue"] for r in structured_reviews if r["reviewRating"]["ratingValue"] is not None]
            if ratings:
                avg_rating = sum(ratings) / len(ratings)

        company_jsonld = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": display_name,
            "url": canonical,
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
            "canonical": canonical,
            "hreflangs": hreflangs,
            "meta_title": meta_title,
            "meta_desc": meta_desc,
            "og_url": og_url,
            "og_image": og_image,
            "base_url": base_url,
        }
    )