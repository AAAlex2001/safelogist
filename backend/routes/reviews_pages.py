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
from helpers.financial_translations import (
    get_translated_group_name, get_translated_indicator
)

# Настройка логирования
logger = logging.getLogger(__name__)

router = APIRouter(tags=["reviews_pages"])
templates = Jinja2Templates(directory="templates")




# === Вспомогательные функции для SEO ===

def generate_company_seo(
    company_name: str,
    reviews_count: int,
    avg_rating: float | None,
    jurisdiction: str | None,
    t: dict,
    page: int = 1,
    financial_data: dict | None = None
) -> dict:
    """
    Генерирует SEO title и description на основе данных компании.

    Логика выбора шаблона:
    - Страница > 1 → шаблон пагинации
    - Высокий рейтинг (>=4.5) → позитивный шаблон
    - Нет отзывов (0) + есть юрисдикция → географический шаблон
    - Нет отзывов, нет юрисдикции → шаблон без отзывов
    - Есть отзывы и рейтинг → рейтинговый шаблон
    - Есть отзывы, нет рейтинга → нейтральный шаблон
    - Иначе → базовый шаблон
    """

    rating_str = f"{avg_rating:.1f}" if avg_rating else None
    jurisdiction_str = jurisdiction if jurisdiction and jurisdiction != "—" else None

    # Выбираем базовый шаблон в зависимости от данных
    # Высокий рейтинг (>=4.5) → позитивный шаблон
    if avg_rating and avg_rating >= 4.5 and reviews_count > 0:
        if page > 1:
            title = t["seo_title_positive_page"].format(company=company_name, page=page)
            desc = t["seo_desc_positive_page"].format(company=company_name, rating=rating_str, reviews=reviews_count, page=page)
        else:
            title = t["seo_title_positive"].format(company=company_name)
            desc = t["seo_desc_positive"].format(company=company_name, rating=rating_str, reviews=reviews_count)

    # Нет отзывов + есть юрисдикция + есть финансовые данные → шаблон с финансами
    elif reviews_count == 0 and jurisdiction_str and financial_data:
        # Формируем динамическое описание на основе доступных показателей
        fin_parts = []
        if financial_data.get('assets'):
            fin_parts.append(f"активы {financial_data['assets']}")
        if financial_data.get('fixed_assets'):
            fin_parts.append(f"внеоборотные активы {financial_data['fixed_assets']}")
        if financial_data.get('current_assets'):
            fin_parts.append(f"оборотные активы {financial_data['current_assets']}")
        if financial_data.get('cash'):
            fin_parts.append(f"денежные средства {financial_data['cash']}")
        if financial_data.get('capital'):
            fin_parts.append(f"капитал {financial_data['capital']}")
        
        fin_info = ", ".join(fin_parts[:3]) if fin_parts else ""  # Берем максимум 3 показателя
        
        if page > 1:
            title = t["seo_title_finances_page"].format(company=company_name, page=page)
            desc = f"{company_name}: {fin_info} — страница {page}. Финансовые отчеты и проверка на SafeLogist." if fin_info else t["seo_desc_finances_page"].format(company=company_name, page=page, assets='', capital='')
        else:
            title = t["seo_title_finances"].format(company=company_name)
            desc = f"{company_name}: {fin_info}. Финансовые отчеты, баланс, прибыли и убытки. Проверка финансового состояния на SafeLogist." if fin_info else t["seo_desc_finances"].format(company=company_name, assets='', capital='')
    
    # Нет отзывов + есть юрисдикция (без финансов) → географический шаблон
    elif reviews_count == 0 and jurisdiction_str:
        if page > 1:
            title = t["seo_title_geo_page"].format(company=company_name, jurisdiction=jurisdiction_str, page=page)
            desc = t["seo_desc_geo_page"].format(company=company_name, jurisdiction=jurisdiction_str, page=page)
        else:
            title = t["seo_title_geo"].format(company=company_name, jurisdiction=jurisdiction_str)
            desc = t["seo_desc_geo"].format(company=company_name, jurisdiction=jurisdiction_str)

    # Нет отзывов, нет юрисдикции → базовый шаблон
    elif reviews_count == 0:
        if page > 1:
            title = t["seo_title_base_page"].format(company=company_name, page=page)
            desc = t["seo_desc_base_page"].format(company=company_name, page=page)
        else:
            title = t["seo_title_base"].format(company=company_name)
            desc = t["seo_desc_base"].format(company=company_name)

    # Есть отзывы и рейтинг → рейтинговый шаблон
    elif avg_rating and reviews_count > 0:
        if page > 1:
            title = t["seo_title_rating_page"].format(company=company_name, rating=rating_str, page=page)
            desc = t["seo_desc_rating_page"].format(company=company_name, reviews=reviews_count, rating=rating_str, page=page)
        else:
            title = t["seo_title_rating"].format(company=company_name, rating=rating_str)
            desc = t["seo_desc_rating"].format(company=company_name, reviews=reviews_count, rating=rating_str)

    # Есть отзывы, нет рейтинга → нейтральный шаблон
    elif reviews_count > 0:
        if page > 1:
            title = t["seo_title_neutral_page"].format(company=company_name, page=page)
            desc = t["seo_desc_neutral_page"].format(company=company_name, reviews=reviews_count, page=page)
        else:
            title = t["seo_title_neutral"].format(company=company_name)
            desc = t["seo_desc_neutral"].format(company=company_name, reviews=reviews_count)

    # Базовый шаблон
    else:
        if page > 1:
            title = t["seo_title_base_page"].format(company=company_name, page=page)
            desc = t["seo_desc_base_page"].format(company=company_name, page=page)
        else:
            title = t["seo_title_base"].format(company=company_name)
            desc = t["seo_desc_base"].format(company=company_name)

    return {"title": title, "description": desc}


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
    
    service = ReviewsService(db)

    companies, has_next = await service.get_companies_page(page)
    companies_data = [c.model_dump() for c in companies]

    seo = build_seo_context(request, lang_code)
    t = get_translations(lang_code)

    # Формируем мета-теги: разные для первой страницы и последующих
    if page == 1:
        meta_title = t.get("list_title", "All company reviews") + " | SafeLogist"
        meta_desc = t.get("list_subtitle", "")
    else:
        meta_title = t.get("list_title_page", "All company reviews — page {page}").format(page=page) + " | SafeLogist"
        meta_desc = t.get("list_subtitle_page", "").format(page=page)

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
            "t": t,
            "meta_title": meta_title,
            "meta_desc": meta_desc,
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
        "companies": [{"name": c.name, "id": c.min_review_id, "reviews_count": c.reviews_count} for c in companies]
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
    year: int = Query(None),
    db: AsyncSession = Depends(get_db)
):
    lang_code = normalize_lang(lang)
    t = get_translations(lang_code)
    seo = build_seo_context(request, lang_code)
    
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
    
    # Получаем доступные годы отчетов
    available_years = await service.get_available_report_years(company_name)
    selected_year = year if year and year in available_years else (available_years[0] if available_years else None)
    
    # Получаем данные за выбранный год (для финансовых отчетов)
    financial_review = None
    if selected_year:
        financial_review = await service.get_company_review_by_year(company_name, selected_year)
    
    # Проверяем, занята ли компания (есть ли владелец) и получаем данные владельца
    from models.company import Company
    from models.review import Review
    from models.user import User
    from sqlalchemy import select as sql_select

    base_review_query = sql_select(Review).where(Review.id == company_id)
    base_review_result = await db.execute(base_review_query)
    base_review = base_review_result.scalars().first()
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

    # Вычисляем средний рейтинг и юрисдикцию по ВСЕМ отзывам компании для SEO
    avg_rating = await service.get_company_avg_rating(company_name)
    jurisdiction = await service.get_company_jurisdiction(company_name)

    # Извлекаем финансовые данные для SEO из financial_review (если есть)
    financial_data = None
    if financial_review and hasattr(financial_review, 'detailed_data') and financial_review.detailed_data:
        detailed_data = financial_review.detailed_data
        if isinstance(detailed_data, dict) and 'groups' in detailed_data:
            financial_data = {}
            for group in detailed_data['groups']:
                fields = group.get('fields', [])
                for field in fields:
                    name = field.get('name', '').lower()
                    current = field.get('dateCurrent', '')
                    if current and current.strip():
                        # Итого активы
                        if 'total active' in name or 'итого активы' in name:
                            financial_data['assets'] = current
                        # Итого внеоборотные активы
                        elif 'total active imobilizate' in name or 'итого внеоборотные активы' in name:
                            financial_data['fixed_assets'] = current
                        # Итого оборотные активы
                        elif 'total active circulante' in name or 'итого оборотные активы' in name:
                            financial_data['current_assets'] = current
                        # Денежные средства
                        elif 'numerar' in name or 'денежные средства' in name:
                            financial_data['cash'] = current
                        # Уставный капитал
                        elif 'capital social' in name or 'уставный капитал' in name or 'уставний капітал' in name:
                            financial_data['capital'] = current

    # Генерируем SEO мета-теги с учётом данных компании
    seo_data = generate_company_seo(
        company_name=display_name,
        reviews_count=total_reviews,
        avg_rating=avg_rating,
        jurisdiction=jurisdiction,
        t=t,
        page=page,
        financial_data=financial_data
    )
    meta_title = seo_data["title"]
    meta_desc = seo_data["description"]

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
        source = getattr(review, "source", None) or "—"
        
        # Определяем рейтинг: для ATI по умолчанию 5, для остальных - как есть
        if review.rating is not None:
            rating_value = review.rating
        elif source.upper() == "ATI":
            rating_value = 5
        else:
            rating_value = None

        review_items.append({
            "comment": comment,
            "reviewer": reviewer_name,
            "reviewer_id": reviewer_id,
            "source": source,
            "rating": rating_value,  # Может быть None для не-ATI источников
            "date": review.review_date.strftime("%d.%m.%Y") if review.review_date else "—",
        })
        # Для JSON-LD добавляем только отзывы с рейтингом
        if rating_value is not None:
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
    financial_sections = []
    financial_groups = []
    company_jsonld = {}

    fin_review = financial_review

    def pick(*vals):
        for val in vals:
            if val is None:
                continue
            if isinstance(val, str) and not val.strip():
                continue
            return val
        return None

    def show(val):
        val = pick(val)
        return "—" if val is None else val

    def get_attr(obj, name: str):
        return getattr(obj, name, None) if obj is not None else None

    has_financial_data = bool(
        fin_review
        and get_attr(fin_review, "source") == "Moldova Financial Report"
        and get_attr(fin_review, "fiscal_code")
    )

    main_rows = [
        {"label": t.get("label_full_name"), "value": show(pick(get_attr(base_review, "subject"), get_attr(fin_review, "subject"), company_name))},
        {"label": t.get("label_short_name"), "value": show(pick(get_attr(base_review, "short_name"), get_attr(fin_review, "short_name")))},
        {"label": t.get("label_country"), "value": show(pick(get_attr(base_review, "jurisdiction"), get_attr(base_review, "country"), get_attr(fin_review, "jurisdiction"), get_attr(fin_review, "country")))},
        {"label": t.get("label_status_company"), "value": show(pick(get_attr(base_review, "status"), get_attr(fin_review, "status")))},
        {"label": t.get("label_legal_form"), "value": show(pick(get_attr(base_review, "legal_form"), get_attr(fin_review, "legal_form")))},
    ]

    if has_financial_data:
        main_rows.extend([
            {"label": t.get("label_fiscal_code", "Фискальный код"), "value": show(get_attr(fin_review, "fiscal_code"))},
            {"label": t.get("label_cuiio", "CUIIO"), "value": show(get_attr(fin_review, "cuiio"))},
            {"label": t.get("label_cfoj", "Организационная форма"), "value": show(get_attr(fin_review, "cfoj_name"))},
            {"label": t.get("label_cfp", "Форма собственности"), "value": show(get_attr(fin_review, "cfp_name"))},
            {"label": t.get("label_location", "Населенный пункт"), "value": show(get_attr(fin_review, "cuatm_name"))},
            {"label": t.get("label_is_liquidation", "В ликвидации"), "value": show(t.get("value_yes", "Да") if get_attr(fin_review, "liquidation") else t.get("value_no", "Нет") if get_attr(fin_review, "liquidation") is not None else None)},
        ])

    registration_rows = [
        {"label": t.get("label_registration_number"), "value": show(pick(get_attr(base_review, "registration_number"), get_attr(base_review, "company_number"), get_attr(fin_review, "registration_number"), get_attr(fin_review, "company_number"), get_attr(fin_review, "fiscal_code")))},
        {"label": t.get("label_tax_number"), "value": show(pick(get_attr(base_review, "inn"), get_attr(fin_review, "inn")))},
        {"label": t.get("label_registration_date"), "value": show(pick(get_attr(base_review, "registration_date"), get_attr(fin_review, "registration_date")))},
    ]

    activity_rows = [
        {"label": t.get("label_company_category"), "value": show(pick(get_attr(base_review, "subtype"), get_attr(fin_review, "subtype")))},
        {"label": t.get("label_activity_type"), "value": show(pick(get_attr(base_review, "activity_type"), get_attr(fin_review, "activity_type"), get_attr(fin_review, "caem_name")))},
    ]
    if has_financial_data:
        activity_rows.extend([
            {"label": t.get("label_caem", "CAEM код"), "value": show(get_attr(fin_review, "caem_code"))},
            {"label": t.get("label_caem_name", "Вид деятельности"), "value": show(get_attr(fin_review, "caem_name"))},
        ])

    address_rows = [
        {"label": t.get("label_legal_address"), "value": show(pick(get_attr(base_review, "legal_address"), get_attr(fin_review, "legal_address"), get_attr(fin_review, "street_address")))},
        {"label": t.get("label_postal_address"), "value": show(pick(get_attr(base_review, "mailing_address"), get_attr(fin_review, "mailing_address"), get_attr(fin_review, "street_address")))},
    ]
    if has_financial_data:
        address_rows.append({"label": t.get("label_address", "Адрес"), "value": show(get_attr(fin_review, "street_address"))})

    company_sections = [
        {"title": t.get("section_main", "Основная информация"), "rows": main_rows},
        {"title": t.get("section_registration", "Регистрация"), "rows": registration_rows},
        {"title": t.get("section_activity", "Деятельность"), "rows": activity_rows},
        {"title": t.get("section_addresses", "Адреса"), "rows": address_rows},
    ]

    contact_rows = []
    contact_person = pick(get_attr(company, "contact_person"), owner_data.get("name") if owner_data else None)
    if contact_person:
        contact_rows.append({"label": t.get("label_contact_person", "Контактное лицо"), "value": show(contact_person)})
    if owner_data and owner_data.get("position"):
        contact_rows.append({"label": t.get("label_position", "Должность"), "value": show(owner_data.get("position"))})

    contact_rows.append({"label": t.get("label_email", "Email"), "value": show(pick(get_attr(company, "contact_email"), owner_data.get("email") if owner_data else None, get_attr(fin_review, "email")))})
    contact_rows.append({"label": t.get("label_phone", "Телефон"), "value": show(pick(get_attr(company, "contact_phone"), owner_data.get("phone") if owner_data else None, get_attr(fin_review, "phone")))})
    contact_rows.append({"label": t.get("label_web", "Веб-сайт"), "value": show(pick(get_attr(company, "website"), get_attr(fin_review, "web")))})

    if any(r["value"] != "—" for r in contact_rows):
        company_sections.append({"title": t.get("section_contacts", "Контактная информация"), "rows": contact_rows})

    if has_financial_data:
        period_str = ""
        if get_attr(fin_review, "period_from") and get_attr(fin_review, "period_to"):
            period_str = f"{fin_review.period_from} — {fin_review.period_to}"
        elif get_attr(fin_review, "period_from"):
            period_str = str(fin_review.period_from)
        report_rows = [
            {"label": t.get("label_report_year", "Год отчета"), "value": show(get_attr(fin_review, "report_year"))},
            {"label": t.get("label_report_period", "Период отчета"), "value": show(period_str) if period_str else "—"},
            {"label": t.get("label_report_type", "Тип отчета"), "value": show(get_attr(fin_review, "report_type"))},
            {"label": t.get("label_report_status", "Статус отчета"), "value": show(get_attr(fin_review, "report_status"))},
            {"label": t.get("label_audited", "Аудирован"), "value": show(t.get("value_yes", "Да") if get_attr(fin_review, "is_audited") else t.get("value_no", "Нет") if get_attr(fin_review, "is_audited") is not None else None)},
            {"label": t.get("label_signed", "Подписан"), "value": show(t.get("value_yes", "Да") if get_attr(fin_review, "signed") else t.get("value_no", "Нет") if get_attr(fin_review, "signed") is not None else None)},
            {"label": t.get("label_declaration_date", "Дата декларации"), "value": show(get_attr(fin_review, "declaration_date"))},
        ]
        company_sections.append({"title": t.get("section_financial_report", "Данные отчета"), "rows": report_rows})

    company_sections.extend([
        {
            "title": t.get("section_capital", "Капитал"),
            "rows": [
                {"label": t.get("label_authorized_capital"), "value": show(pick(get_attr(base_review, "authorized_capital"), get_attr(fin_review, "authorized_capital")))},
                {"label": t.get("label_paid_capital"), "value": show(pick(get_attr(base_review, "paid_up_capital"), get_attr(fin_review, "paid_up_capital")))},
            ],
        },
        {
            "title": t.get("section_management", "Руководство и учредители"),
            "rows": [
                {"label": t.get("label_manager"), "value": show(pick(get_attr(base_review, "managers"), get_attr(fin_review, "managers")))},
                {"label": t.get("label_founder"), "value": show(pick(get_attr(base_review, "branch"), get_attr(fin_review, "branch")))},
            ],
        },
        {
            "title": t.get("section_existence", "Статус существования"),
            "rows": [
                {"label": t.get("label_status"), "value": show(pick(get_attr(base_review, "status"), get_attr(fin_review, "status")))},
                {"label": t.get("label_liquidation_date"), "value": show(pick(get_attr(base_review, "liquidation_date"), get_attr(fin_review, "liquidation_date")))},
            ],
        },
    ])

    if has_financial_data:
        detailed_data = get_attr(fin_review, "detailed_data")
        if detailed_data and isinstance(detailed_data, dict):
            groups = detailed_data.get("groups", [])
            for group in groups:
                group_name = group.get("name", "")
                fields = group.get("fields", [])
                translated_group_name = get_translated_group_name(group_name, lang)
                rows = []
                for field in fields:
                    code = field.get("code", "")
                    name = field.get("name", "")
                    date_prev = field.get("datePrev", "")
                    date_current = field.get("dateCurrent", "")
                    translated_name = get_translated_indicator(code, name, lang)
                    if date_prev or date_current:
                        rows.append({
                            "code": code,
                            "name": translated_name,
                            "date_prev": date_prev if date_prev else "—",
                            "date_current": date_current if date_current else "—",
                        })
                if rows:
                    financial_groups.append({
                        "title": translated_group_name,
                        "rows": rows,
                    })

    first_for_jsonld = fin_review or base_review
    if first_for_jsonld:
        company_jsonld = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": display_name,
            "url": seo['canonical'],
            "identifier": getattr(first_for_jsonld, "id", None),
            "address": {
                "@type": "PostalAddress",
                "streetAddress": getattr(first_for_jsonld, "legal_address", None) or getattr(first_for_jsonld, "street_address", None) or "—",
                "addressCountry": getattr(first_for_jsonld, "jurisdiction", None) or getattr(first_for_jsonld, "country", None) or "—",
            },
            "foundingDate": getattr(first_for_jsonld, "registration_date", None),
            "legalName": getattr(first_for_jsonld, "short_name", None) or display_name,
            "sameAs": getattr(first_for_jsonld, "link", None) if hasattr(first_for_jsonld, "link") else None,
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
            "financial_sections": financial_sections,
            "financial_groups": financial_groups,
            "available_years": available_years,
            "selected_year": selected_year,
            "meta_title": meta_title,
            "meta_desc": meta_desc,
            "og_url": seo['canonical'],
            "og_image": f"{seo['base_url']}/static/safelogist_1.png",
            "is_claimed": is_claimed,
            "owner_data": owner_data,  # Данные владельца
            "avg_rating": avg_rating,  # Средний рейтинг
            "show_locked_ui": True,
            **seo,
        }
    )
