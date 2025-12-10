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
    
    # Быстрый запрос с COUNT через GROUP BY (с индексом это работает нормально)
    query = (
        select(
            Review.subject,
            func.count(Review.id).label('reviews_count')
        )
        .group_by(Review.subject)
        .order_by(Review.subject)  # По алфавиту, а не по COUNT!
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
    
    # Если получили полную страницу, значит есть еще данные
    has_next = len(companies_data) == per_page
    
    return templates.TemplateResponse(
        "reviews_list.html",
        {
            "request": request,
            "reports": companies_data,
            "current_page": page,
            "total_pages": None,  # Не показываем точное число
            "total_companies": None,  # Не показываем точное число
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
    API endpoint для автопоиска компаний (JSON)
    """
    # Быстрый поиск без COUNT (для автопоиска)
    query = (
        select(Review.subject)
        .distinct()
        .where(Review.subject.ilike(f'%{q}%'))
        .order_by(Review.subject)
        .limit(limit)
    )
    
    result = await db.execute(query)
    companies = result.scalars().all()
    
    return JSONResponse(content={
        "companies": [
            {
                "name": company,
                "slug": quote(company, safe='')
            }
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
    # Поиск с COUNT
    query = (
        select(
            Review.subject,
            func.count(Review.id).label('reviews_count')
        )
        .where(Review.subject.ilike(f'%{q}%'))
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
            'reviews_count': row.reviews_count
        }
        for row in rows
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
    Страница с отзывами конкретной компании с пагинацией
    """
    per_page = 10
    offset = (page - 1) * per_page
    
    # Декодируем URL и slug
    company_slug = unquote(company_slug)
    
    # Получаем общее количество отзывов для компании
    count_query = select(func.count(Review.id)).where(Review.subject == company_slug)
    count_result = await db.execute(count_query)
    total_reviews = count_result.scalar() or 0
    
    # Если не нашли, пробуем по частичному совпадению
    if total_reviews == 0:
        company_name = company_slug.replace('-', ' ')
        count_query = select(func.count(Review.id)).where(Review.subject.ilike(f'%{company_name}%'))
        count_result = await db.execute(count_query)
        total_reviews = count_result.scalar() or 0
        search_condition = Review.subject.ilike(f'%{company_name}%')
    else:
        search_condition = Review.subject == company_slug
    
    if total_reviews == 0:
        return HTMLResponse(content="<h1>404 - Компания не найдена</h1>", status_code=404)
    
    # Получаем отзывы для текущей страницы
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
    
    # Вычисляем пагинацию
    total_pages = (total_reviews + per_page - 1) // per_page
    
    # Генерируем HTML с отзывами
    reviews_html = ""
    for review in reviews:
        comment = review.comment or "Без комментария"
        reviewer = review.reviewer or "Аноним"
        date = review.review_date.strftime("%d.%m.%Y") if review.review_date else "Дата неизвестна"
        reviews_html += f"""
        <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
            <p><strong>{reviewer}</strong> • {date}</p>
            <p>{comment}</p>
        </div>
        """
    
    # Пагинация
    pagination_html = '<div style="margin-top: 30px; display: flex; gap: 10px; justify-content: center; align-items: center;">'
    if page > 1:
        pagination_html += f'<a href="?page={page - 1}" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">← Назад</a>'
    pagination_html += f'<span style="padding: 10px;">Страница {page} из {total_pages}</span>'
    if page < total_pages:
        pagination_html += f'<a href="?page={page + 1}" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">Вперёд →</a>'
    pagination_html += '</div>'
    
    return HTMLResponse(
        content=f"""
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{reviews[0].subject} - Отзывы (страница {page})</title>
            <meta name="description" content="Отзывы о компании {reviews[0].subject}. Всего отзывов: {total_reviews}. Страница {page} из {total_pages}">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <a href="/reviews" style="color: #007bff; text-decoration: none;">← Назад к списку</a>
            <h1>{reviews[0].subject}</h1>
            <p style="color: #666;">Всего отзывов: {total_reviews} | Страница {page} из {total_pages}</p>
            <hr>
            {reviews_html}
            {pagination_html}
        </body>
        </html>
        """,
        status_code=200
    )

