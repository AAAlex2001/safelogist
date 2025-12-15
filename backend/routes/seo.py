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

SUPPORTED_LANGS = ["ru", "en", "uk", "ro"]
DEFAULT_LANG = "ru"
SITEMAP_DIR = "static/sitemaps"
os.makedirs(SITEMAP_DIR, exist_ok=True)

router = APIRouter(tags=["seo"])


def normalize_lang(lang: str) -> str:
    lang_code = (lang or "").lower()
    return lang_code if lang_code in SUPPORTED_LANGS else DEFAULT_LANG


def save_sitemap(content: str, filename: str) -> None:
    """Сохранить sitemap в статическую директорию"""
    try:
        filepath = os.path.join(SITEMAP_DIR, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
    except IOError as e:
        print(f"Error saving sitemap {filename}: {e}")


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
    filename = "sitemap.xml"
    filepath = os.path.join(SITEMAP_DIR, filename)
    
    # Если файл существует, отдаём его
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        return Response(content=content, media_type="application/xml")
    
    # Если файла нет, генерируем
    base_url = os.getenv("BASE_URL", str(request.base_url)).rstrip('/')
    if base_url.startswith("http://"):
        base_url = "https://" + base_url.removeprefix("http://")
    
    # Ищем все сгенерированные sitemap файлы
    sitemaps = []
    for filename in sorted(os.listdir(SITEMAP_DIR)):
        if filename.startswith("sitemap-") and filename.endswith(".xml"):
            sitemaps.append(f"""  <sitemap>
    <loc>{base_url}/{filename}</loc>
    <lastmod>{datetime.now().date().isoformat()}</lastmod>
  </sitemap>""")
    
    sitemap_index = f"""<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd">
{chr(10).join(sitemaps)}
</sitemapindex>
"""
    
    save_sitemap(sitemap_index, filename)
    return Response(content=sitemap_index, media_type="application/xml")


@router.get("/sitemap-pages-{lang}-{page_num}.xml", response_class=Response)
async def sitemap_pages(lang: str, page_num: int, request: Request, db: AsyncSession = Depends(get_db)):
    """
    Sitemap для пагинации списка отзывов (по языкам)
    """
    lang_code = normalize_lang(lang)
    filename = f"sitemap-pages-{lang_code}-{page_num}.xml"
    filepath = os.path.join(SITEMAP_DIR, filename)
    
    # Если файл существует, отдаём его
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        return Response(content=content, media_type="application/xml")
    
    # Если файла нет, генерируем
    base_url = os.getenv("BASE_URL", str(request.base_url)).rstrip('/')
    if base_url.startswith("http://"):
        base_url = "https://" + base_url.removeprefix("http://")
    
    # Получаем количество компаний для расчета пагинации
    count_query = select(func.count(func.distinct(Review.subject)))
    count_result = await db.execute(count_query)
    total_companies = count_result.scalar() or 0
    
    companies_per_page = 10
    total_pages = max(1, (total_companies + companies_per_page - 1) // companies_per_page)
    
    # Максимум 40,000 URL на файл (главная + пагинация)
    max_urls_per_sitemap = 40000
    pages_per_sitemap = max_urls_per_sitemap - 1  # -1 для главной страницы
    
    start_page = (page_num - 1) * pages_per_sitemap + 1
    end_page = min(start_page + pages_per_sitemap - 1, total_pages)
    
    urls = []
    
    # Первая страница только в первом sitemap
    if page_num == 1:
        urls.append(f"""  <url>
    <loc>{base_url}/{lang_code}/reviews</loc>
    <lastmod>{datetime.now().date().isoformat()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>""")
        start_page = 2
    
    # Страницы пагинации
    for page in range(start_page, end_page + 1):
        urls.append(f"""  <url>
    <loc>{base_url}/{lang_code}/reviews?page={page}</loc>
    <lastmod>{datetime.now().date().isoformat()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>""")
    
    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
{chr(10).join(urls)}
</urlset>
"""
    
    save_sitemap(sitemap, filename)
    return Response(content=sitemap, media_type="application/xml")


@router.get("/sitemap-{lang}-{page}.xml", response_class=Response)
async def sitemap_companies(lang: str, page: int, request: Request, db: AsyncSession = Depends(get_db)):
    lang_code = normalize_lang(lang)
    filename = f"sitemap-{lang_code}-{page}.xml"
    filepath = os.path.join(SITEMAP_DIR, filename)
    
    # Если файл существует, отдаём его
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        return Response(content=content, media_type="application/xml")
    
    # Если файла нет, генерируем
    base_url = os.getenv("BASE_URL", str(request.base_url)).rstrip('/')
    if base_url.startswith("http://"):
        base_url = "https://" + base_url.removeprefix("http://")
    
    max_urls_per_sitemap = 45000  # Жесткий лимит
    reviews_per_page = 10
    batch_size = 5000  # Берем с запасом для фильтрации
    offset = (page - 1) * batch_size

    # Получаем компании с их минимальным ID (для URL) и количеством отзывов
    query = (
        select(
            Review.subject.label("subject"),
            func.min(Review.id).label("company_id"),
            func.count(Review.id).label("reviews_count")
        )
        .group_by(Review.subject)
        .order_by(Review.subject)
        .limit(batch_size)
        .offset(offset)
    )
    result = await db.execute(query)
    companies = result.all()
    
    urls = []
    current_url_count = 0
    
    for row in companies:
        company_id = row.company_id
        reviews_count = row.reviews_count or 0
        total_pages = max(1, (reviews_count + reviews_per_page - 1) // reviews_per_page)
        
        # Рассчитываем количество URL для этой компании
        company_urls_count = total_pages
        
        # Проверяем, не превысим ли лимит, добавив ВСЕ страницы этой компании
        if current_url_count + company_urls_count > max_urls_per_sitemap and current_url_count > 0:
            # Останавливаемся, не добавляя эту компанию
            break

        # Первая страница (основная)
        urls.append(f"""  <url>
    <loc>{base_url}/{lang_code}/reviews/item/{company_id}</loc>
    <lastmod>{datetime.now().date().isoformat()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>""")

        # Все остальные страницы пагинации
        if total_pages > 1:
            for page_num in range(2, total_pages + 1):
                urls.append(f"""  <url>
    <loc>{base_url}/{lang_code}/reviews/item/{company_id}?page={page_num}</loc>
    <lastmod>{datetime.now().date().isoformat()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>""")
        
        current_url_count += company_urls_count
    
    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
{chr(10).join(urls)}
</urlset>
"""
    
    save_sitemap(sitemap, filename)
    return Response(content=sitemap, media_type="application/xml")

