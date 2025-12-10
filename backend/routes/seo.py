"""
SEO роуты: sitemap.xml, robots.txt
"""
from fastapi import APIRouter, Depends, Request
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime

from database import get_db
from models.review import Review

router = APIRouter(tags=["seo"])


@router.get("/robots.txt", response_class=Response)
async def robots_txt():
    """
    Файл robots.txt для поисковых систем
    """
    content = """User-agent: *
Allow: /
Disallow: /admin/
Disallow: /auth/
Disallow: /api/

Sitemap: https://safelogist.net/sitemap.xml
"""
    return Response(content=content, media_type="text/plain")


@router.get("/sitemap.xml", response_class=Response)
async def sitemap_index(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Sitemap Index - главный файл со ссылками на все sitemap
    """
    base_url = str(request.base_url).rstrip('/')
    
    # Получаем общее количество компаний
    count_query = select(func.count(func.distinct(Review.subject)))
    count_result = await db.execute(count_query)
    total_companies = count_result.scalar() or 0
    
    # Рассчитываем количество sitemap файлов (по 10000 URL в каждом)
    urls_per_sitemap = 10000
    num_sitemaps = (total_companies + urls_per_sitemap - 1) // urls_per_sitemap
    
    sitemaps = []
    
    # Статический sitemap (главная страница)
    sitemaps.append(f"""  <sitemap>
    <loc>{base_url}/sitemap-static.xml</loc>
    <lastmod>{datetime.now().date().isoformat()}</lastmod>
  </sitemap>""")
    
    # Динамические sitemap для компаний
    for i in range(num_sitemaps):
        sitemaps.append(f"""  <sitemap>
    <loc>{base_url}/sitemap-{i + 1}.xml</loc>
    <lastmod>{datetime.now().date().isoformat()}</lastmod>
  </sitemap>""")
    
    sitemap_index = f"""<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(sitemaps)}
</sitemapindex>"""
    
    return Response(content=sitemap_index, media_type="application/xml")


@router.get("/sitemap-static.xml", response_class=Response)
async def sitemap_static(request: Request):
    """
    Статический sitemap для главных страниц
    """
    base_url = str(request.base_url).rstrip('/')
    
    urls = [
        f"""  <url>
    <loc>{base_url}/reviews</loc>
    <lastmod>{datetime.now().date().isoformat()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>"""
    ]
    
    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>"""
    
    return Response(content=sitemap, media_type="application/xml")


@router.get("/sitemap-{page}.xml", response_class=Response)
async def sitemap_companies(page: int, request: Request, db: AsyncSession = Depends(get_db)):
    """
    Динамический sitemap для страниц компаний
    """
    base_url = str(request.base_url).rstrip('/')
    
    # Пагинация
    urls_per_sitemap = 10000
    offset = (page - 1) * urls_per_sitemap
    
    # Получаем компании для этой страницы
    query = (
        select(Review.subject)
        .distinct()
        .order_by(Review.subject)
        .limit(urls_per_sitemap)
        .offset(offset)
    )
    result = await db.execute(query)
    companies = result.scalars().all()
    
    urls = []
    for company in companies:
        # Создаем slug из названия компании
        slug = company.replace(' ', '-').replace('"', '').replace("'", "")[:100]
        urls.append(f"""  <url>
    <loc>{base_url}/reviews/{slug}</loc>
    <lastmod>{datetime.now().date().isoformat()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>""")
    
    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>"""
    
    return Response(content=sitemap, media_type="application/xml")

