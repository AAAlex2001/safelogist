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
    per_page = 10
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
    
    # Получаем общее количество компаний
    count_query = select(func.count(func.distinct(Review.subject)))
    count_result = await db.execute(count_query)
    total_companies = count_result.scalar() or 0
    
    total_pages = (total_companies + per_page - 1) // per_page
    
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
            "total_companies": total_companies
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


@router.get("/reviews/{company_slug}", response_class=HTMLResponse)
async def company_reviews_page(
    request: Request,
    company_slug: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Страница с отзывами конкретной компании
    """
    # Декодируем slug обратно в название компании
    company_name = company_slug.replace('-', ' ')
    
    # Получаем все отзывы компании
    query = (
        select(Review)
        .where(Review.subject.ilike(f'%{company_name}%'))
        .order_by(Review.review_date.desc())
    )
    
    result = await db.execute(query)
    reviews = result.scalars().all()
    
    if not reviews:
        return HTMLResponse(content="<h1>404 - Компания не найдена</h1>", status_code=404)
    
    # TODO: создать шаблон для страницы компании
    return HTMLResponse(
        content=f"<h1>{reviews[0].subject}</h1><p>Отзывов: {len(reviews)}</p>",
        status_code=200
    )

