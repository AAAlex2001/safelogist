"""
Скрипт для генерации статических sitemap файлов.
Запускать периодически (cron) или после обновления данных.

Usage: python generate_sitemap.py
"""
import os
import asyncio
from datetime import datetime
from sqlalchemy import select, func

from database import async_session
from models.company import Company

SUPPORTED_LANGS = ["ru", "en", "uk", "ro"]
BASE_URL = os.getenv("BASE_URL", "https://safelogist.net")
SITEMAP_DIR = "static/sitemaps"
COMPANIES_PER_SITEMAP = 10000
REVIEWS_PER_PAGE = 10


async def generate_sitemaps():
    """Генерация всех sitemap файлов"""
    os.makedirs(SITEMAP_DIR, exist_ok=True)

    async with async_session() as db:
        # Получаем все компании
        query = select(Company).order_by(Company.name)
        result = await db.execute(query)
        companies = result.scalars().all()

    total = len(companies)
    num_sitemaps = (total + COMPANIES_PER_SITEMAP - 1) // COMPANIES_PER_SITEMAP
    today = datetime.now().date().isoformat()

    print(f"Total companies: {total}")
    print(f"Sitemaps per lang: {num_sitemaps}")

    # 1. Генерируем sitemap-static.xml
    generate_static_sitemap(today)

    # 2. Генерируем sitemap для компаний по языкам
    for lang in SUPPORTED_LANGS:
        for page in range(1, num_sitemaps + 1):
            start = (page - 1) * COMPANIES_PER_SITEMAP
            end = start + COMPANIES_PER_SITEMAP
            page_companies = companies[start:end]
            generate_companies_sitemap(lang, page, page_companies, today)

    # 3. Генерируем sitemap index
    generate_sitemap_index(num_sitemaps, today)

    print(f"Done! Files saved to {SITEMAP_DIR}/")


def generate_static_sitemap(today: str):
    """Генерация sitemap-static.xml"""
    urls = []
    for lang in SUPPORTED_LANGS:
        urls.append(f"""  <url>
    <loc>{BASE_URL}/{lang}/reviews</loc>
    <lastmod>{today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>""")

    content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>"""

    with open(f"{SITEMAP_DIR}/sitemap-static.xml", "w") as f:
        f.write(content)
    print("Generated sitemap-static.xml")


def generate_companies_sitemap(lang: str, page: int, companies: list, today: str):
    """Генерация sitemap для компаний"""
    urls = []

    for company in companies:
        company_id = company.min_review_id
        if not company_id:
            continue

        reviews_count = company.reviews_count or 0
        total_pages = max(1, (reviews_count + REVIEWS_PER_PAGE - 1) // REVIEWS_PER_PAGE)

        # Первая страница
        urls.append(f"""  <url>
    <loc>{BASE_URL}/{lang}/reviews/item/{company_id}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>""")

        # Страницы пагинации
        for page_num in range(2, min(total_pages + 1, 101)):  # max 100 pages
            urls.append(f"""  <url>
    <loc>{BASE_URL}/{lang}/reviews/item/{company_id}?page={page_num}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>""")

    content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>"""

    filename = f"sitemap-{lang}-{page}.xml"
    with open(f"{SITEMAP_DIR}/{filename}", "w") as f:
        f.write(content)
    print(f"Generated {filename} ({len(urls)} URLs)")


def generate_sitemap_index(num_sitemaps: int, today: str):
    """Генерация главного sitemap.xml"""
    sitemaps = []

    sitemaps.append(f"""  <sitemap>
    <loc>{BASE_URL}/sitemaps/sitemap-static.xml</loc>
    <lastmod>{today}</lastmod>
  </sitemap>""")

    for lang in SUPPORTED_LANGS:
        for i in range(1, num_sitemaps + 1):
            sitemaps.append(f"""  <sitemap>
    <loc>{BASE_URL}/sitemaps/sitemap-{lang}-{i}.xml</loc>
    <lastmod>{today}</lastmod>
  </sitemap>""")

    content = f"""<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(sitemaps)}
</sitemapindex>"""

    with open(f"{SITEMAP_DIR}/sitemap.xml", "w") as f:
        f.write(content)
    print(f"Generated sitemap.xml (index with {len(sitemaps)} sitemaps)")


if __name__ == "__main__":
    asyncio.run(generate_sitemaps())
