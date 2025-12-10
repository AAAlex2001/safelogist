"""
Роуты для серверного рендеринга страниц с отзывами
"""
from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import HTMLResponse
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
    per_page = 50
    offset = (page - 1) * per_page
    
    # Получаем компании с количеством отзывов
    query = (
        select(
            Review.subject,
            func.count(Review.id).label('reviews_count')
        )
        .group_by(Review.subject)
        .order_by(func.count(Review.id).desc())
        .limit(per_page)
        .offset(offset)
    )
    
    result = await db.execute(query)
    companies = result.all()
    
    # Примерный подсчет (быстрее чем точный COUNT)
    # Если получили полную страницу, значит есть еще данные
    has_next = len(companies) == per_page
    total_pages = page + 1 if has_next else page
    
    # Формируем данные для шаблона
    reports_data = [
        {
            'company_name': row.subject,
            'reviews_count': row.reviews_count
        }
        for row in companies
    ]
    
    return templates.TemplateResponse(
        "reviews_list.html",
        {
            "request": request,
            "reports": reports_data,
            "current_page": page,
            "total_pages": total_pages,
            "total_companies": None,  # Не показываем точное число
            "has_next": has_next
        }
    )


@router.get("/reviews/search", response_class=HTMLResponse)
async def reviews_search_page(
    request: Request,
    q: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db)
):
    """
    Страница поиска компаний
    """
    # Поиск по названию компании
    query = (
        select(
            Review.subject,
            func.count(Review.id).label('reviews_count')
        )
        .where(Review.subject.ilike(f'%{q}%'))
        .group_by(Review.subject)
        .order_by(func.count(Review.id).desc())
        .limit(50)
    )
    
    result = await db.execute(query)
    companies = result.all()
    
    # Формируем данные для шаблона
    reports_data = [
        {
            'company_name': row.subject,
            'reviews_count': row.reviews_count
        }
        for row in companies
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
    db: AsyncSession = Depends(get_db)
):
    """
    Страница с отзывами конкретной компании
    """
    from urllib.parse import unquote
    
    # Декодируем URL и slug
    company_slug = unquote(company_slug)
    
    # Пробуем найти точное совпадение сначала
    query = (
        select(Review)
        .where(Review.subject == company_slug)
        .order_by(Review.review_date.desc())
    )
    
    result = await db.execute(query)
    reviews = result.scalars().all()
    
    # Если не нашли, пробуем по частичному совпадению
    if not reviews:
        company_name = company_slug.replace('-', ' ')
        query = (
            select(Review)
            .where(Review.subject.ilike(f'%{company_name}%'))
            .order_by(Review.review_date.desc())
            .limit(100)
        )
        result = await db.execute(query)
        reviews = result.scalars().all()
    
    if not reviews:
        return HTMLResponse(content="<h1>404 - Компания не найдена</h1>", status_code=404)
    
    # Простая HTML страница с отзывами
    reviews_html = ""
    for review in reviews[:20]:  # Показываем первые 20
        comment = review.comment or "Без комментария"
        reviewer = review.reviewer or "Аноним"
        date = review.review_date.strftime("%d.%m.%Y") if review.review_date else "Дата неизвестна"
        reviews_html += f"""
        <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
            <p><strong>{reviewer}</strong> • {date}</p>
            <p>{comment}</p>
        </div>
        """
    
    return HTMLResponse(
        content=f"""
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{reviews[0].subject} - Отзывы</title>
            <meta name="description" content="Отзывы о компании {reviews[0].subject}. Всего отзывов: {len(reviews)}">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <a href="/reviews" style="color: #007bff; text-decoration: none;">← Назад к списку</a>
            <h1>{reviews[0].subject}</h1>
            <p style="color: #666;">Всего отзывов: {len(reviews)}</p>
            <hr>
            {reviews_html}
        </body>
        </html>
        """,
        status_code=200
    )

