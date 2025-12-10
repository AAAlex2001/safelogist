"""
Роуты для серверного рендеринга страниц с отзывами
"""
from urllib.parse import quote, unquote
from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import HTMLResponse, JSONResponse
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


@router.get("/reviews", response_class=HTMLResponse)
async def reviews_list_page(
    request: Request,
    page: int = Query(1, ge=1),
    db: AsyncSession = Depends(get_db)
):
    """
    Страница со списком всех компаний с отзывами
    """
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

    return templates.TemplateResponse(
        "reviews_list.html",
        {
            "request": request,
            "reports": companies_data,
            "current_page": page,
            "total_pages": None,
            "total_companies": None,
            "has_next": has_next
        }
    )


@router.get("/api/reviews/search", response_class=JSONResponse)
async def reviews_search_api(
    q: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """
    API для быстрого автопоиска компаний
    Ищет по таблице companies (166к строк) — ~1ms
    """
    search_term = q.strip().lower()
    if not search_term:
        return JSONResponse(content={"companies": []})

    pattern = f'%{search_term}%'

    # Поиск по таблице companies через SQLAlchemy
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


@router.get("/reviews/search", response_class=HTMLResponse)
async def reviews_search_page(
    request: Request,
    q: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db)
):
    """
    Страница поиска компаний
    """
    search_term = q.strip().lower()
    pattern = f'%{search_term}%'

    # Сначала находим компании быстро
    company_query = (
        select(Company.name)
        .where(func.lower(Company.name).like(pattern))
        .order_by(Company.name)
        .limit(50)
    )
    result = await db.execute(company_query)
    company_names = result.scalars().all()

    # Потом получаем количество отзывов
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

    return templates.TemplateResponse(
        "reviews_list.html",
        {
            "request": request,
            "reports": reports_data,
            "current_page": 1,
            "total_pages": 1,
            "total_companies": len(reports_data),
            "search_query": q
        }
    )


@router.get("/reviews/{company_slug:path}", response_class=HTMLResponse)
async def company_reviews_page(
    request: Request,
    company_slug: str,
    page: int = Query(1, ge=1),
    db: AsyncSession = Depends(get_db)
):
    """
    Страница с отзывами конкретной компании
    """
    per_page = 10
    offset = (page - 1) * per_page

    company_name = unquote(company_slug)

    # Точное совпадение
    count_query = select(func.count(Review.id)).where(Review.subject == company_name)
    count_result = await db.execute(count_query)
    total_reviews = count_result.scalar() or 0

    if total_reviews > 0:
        search_condition = Review.subject == company_name
    else:
        # Поиск по таблице companies
        pattern = f'%{company_name.lower()}%'
        like_query = (
            select(Company.name)
            .where(func.lower(Company.name).like(pattern))
            .limit(1)
        )
        like_result = await db.execute(like_query)
        found = like_result.scalar()

        if not found:
            return HTMLResponse(
                content="""<!DOCTYPE html>
                <html lang="ru"><head><meta charset="UTF-8"><title>404</title></head>
                <body style="font-family:Arial;max-width:800px;margin:0 auto;padding:20px;">
                <a href="/reviews">← Назад</a><h1>Компания не найдена</h1></body></html>""",
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

    if not reviews:
        return HTMLResponse(content="<h1>404 - Страница не найдена</h1>", status_code=404)

    total_pages = (total_reviews + per_page - 1) // per_page
    display_name = reviews[0].subject

    reviews_html = ""
    for review in reviews:
        comment = review.comment or "Без комментария"
        reviewer = review.reviewer or "Аноним"
        date = review.review_date.strftime("%d.%m.%Y") if review.review_date else "Дата неизвестна"
        reviews_html += f"""
        <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
            <p><strong>{reviewer}</strong> • {date}</p>
            <p>{comment}</p>
        </div>"""

    pagination_html = '<div style="margin-top: 30px; display: flex; gap: 10px; justify-content: center; align-items: center;">'
    if page > 1:
        pagination_html += f'<a href="?page={page - 1}" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">← Назад</a>'
    pagination_html += f'<span style="padding: 10px;">Страница {page} из {total_pages}</span>'
    if page < total_pages:
        pagination_html += f'<a href="?page={page + 1}" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">Вперёд →</a>'
    pagination_html += '</div>'

    return HTMLResponse(
        content=f"""<!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{display_name} - Отзывы (страница {page})</title>
            <meta name="description" content="Отзывы о компании {display_name}. Всего: {total_reviews}">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <a href="/reviews" style="color: #007bff; text-decoration: none;">← Назад к списку</a>
            <h1>{display_name}</h1>
            <p style="color: #666;">Всего отзывов: {total_reviews} | Страница {page} из {total_pages}</p>
            <hr>
            {reviews_html}
            {pagination_html}
        </body>
        </html>""",
        status_code=200
    )