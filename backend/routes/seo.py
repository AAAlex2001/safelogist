"""
SEO роуты: sitemap.xml, robots.txt
"""
import os
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
    base_url = os.getenv("BASE_URL", str(request.base_url)).rstrip('/')
    if base_url.startswith("http://"):
        base_url = "https://" + base_url.removeprefix("http://")
    
    # Получаем общее количество компаний
    count_query = select(func.count(func.distinct(Review.subject)))
    count_result = await db.execute(count_query)
    total_companies = count_result.scalar() or 0
    
    urls_per_sitemap = 5000
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
    base_url = os.getenv("BASE_URL", str(request.base_url)).rstrip('/')
    if base_url.startswith("http://"):
        base_url = "https://" + base_url.removeprefix("http://")
    
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
    from urllib.parse import quote
    base_url = os.getenv("BASE_URL", str(request.base_url)).rstrip('/')
    if base_url.startswith("http://"):
        base_url = "https://" + base_url.removeprefix("http://")
    
    companies_per_sitemap = 5000
    offset = (page - 1) * companies_per_sitemap
    reviews_per_page = 10

    query = (
        select(
            Review.subject.label("subject"),
            func.count(Review.id).label("reviews_count")
        )
        .group_by(Review.subject)
        .order_by(Review.subject)
        .limit(companies_per_sitemap)
        .offset(offset)
    )
    result = await db.execute(query)
    companies = result.all()
    
    urls = []
    for row in companies:
        company_name = row.subject
        reviews_count = row.reviews_count or 0
        slug = quote(company_name, safe='')
        total_pages = max(1, (reviews_count + reviews_per_page - 1) // reviews_per_page)

        urls.append(f"""  <url>
    <loc>{base_url}/reviews/{slug}</loc>
    <lastmod>{datetime.now().date().isoformat()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>""")

        if total_pages > 1:
            for page_num in range(2, total_pages + 1):
                urls.append(f"""  <url>
    <loc>{base_url}/reviews/{slug}?page={page_num}</loc>
    <lastmod>{datetime.now().date().isoformat()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>""")
    
    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>"""
    
    return Response(content=sitemap, media_type="application/xml")

