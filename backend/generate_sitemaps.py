"""
Скрипт для генерации всех sitemap файлов
Запуск: python generate_sitemaps.py
"""
import os
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select, func
from datetime import datetime
from dotenv import load_dotenv

from models.review import Review

load_dotenv()

SUPPORTED_LANGS = ["ru", "en", "uk", "ro"]
DEFAULT_LANG = "ru"
SITEMAP_DIR = "static/sitemaps"
os.makedirs(SITEMAP_DIR, exist_ok=True)

BASE_URL = os.getenv("BASE_URL", "https://safelogist.net").rstrip('/')


def normalize_lang(lang: str) -> str:
    lang_code = (lang or "").lower()
    return lang_code if lang_code in SUPPORTED_LANGS else DEFAULT_LANG


def save_sitemap(content: str, filename: str) -> None:
    """Сохранить sitemap в файл"""
    filepath = os.path.join(SITEMAP_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✓ Сохранён: {filename}")


async def generate_sitemap_static():
    """Генерация статического sitemap"""
    urls = []
    for lang in SUPPORTED_LANGS:
        urls.append(f"""  <url>
    <loc>{BASE_URL}/{lang}/reviews</loc>
    <lastmod>{datetime.now().date().isoformat()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>""")

    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
{chr(10).join(urls)}
</urlset>
"""

    save_sitemap(sitemap, "sitemap-static.xml")


async def generate_sitemap_companies(db: AsyncSession, lang: str, page: int):
    """Генерация sitemap для компаний"""
    lang_code = normalize_lang(lang)
    companies_per_sitemap = 10000
    offset = (page - 1) * companies_per_sitemap
    reviews_per_page = 10
    
    # Получаем компании
    query = (
        select(
            Review.subject.label("subject"),
            func.min(Review.id).label("company_id"),
            func.count(Review.id).label("reviews_count")
        )
        .group_by(Review.subject)
        .order_by(Review.subject)
        .limit(companies_per_sitemap)
        .offset(offset)
    )
    result = await db.execute(query)
    companies = result.all()
    
    if not companies:
        return False  # Нет компаний для этой страницы
    
    urls = []
    max_urls_per_sitemap = 40000
    
    for row in companies:
        if len(urls) >= max_urls_per_sitemap:
            break
            
        company_id = row.company_id
        reviews_count = row.reviews_count or 0
        total_pages = max(1, (reviews_count + reviews_per_page - 1) // reviews_per_page)

        # Первая страница (основная)
        urls.append(f"""  <url>
    <loc>{BASE_URL}/{lang_code}/reviews/item/{company_id}</loc>
    <lastmod>{datetime.now().date().isoformat()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>""")

        # Все остальные страницы пагинации
        if total_pages > 1:
            for page_num in range(2, total_pages + 1):
                if len(urls) >= max_urls_per_sitemap:
                    break
                urls.append(f"""  <url>
    <loc>{BASE_URL}/{lang_code}/reviews/item/{company_id}?page={page_num}</loc>
    <lastmod>{datetime.now().date().isoformat()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>""")
    
    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
{chr(10).join(urls)}
</urlset>
"""

    filename = f"sitemap-{lang_code}-{page}.xml"
    save_sitemap(sitemap, filename)
    return True


async def generate_sitemap_index(db: AsyncSession):
    """Генерация главного sitemap index"""
    count_query = select(func.count(func.distinct(Review.subject)))
    count_result = await db.execute(count_query)
    total_companies = count_result.scalar() or 0
    
    companies_per_sitemap = 10000
    num_sitemaps = (total_companies + companies_per_sitemap - 1) // companies_per_sitemap if total_companies > 0 else 1
    
    sitemaps = []
    
    sitemaps.append(f"""  <sitemap>
    <loc>{BASE_URL}/sitemap-static.xml</loc>
    <lastmod>{datetime.now().date().isoformat()}</lastmod>
  </sitemap>""")
    
    for lang in SUPPORTED_LANGS:
        for i in range(num_sitemaps):
            sitemaps.append(f"""  <sitemap>
    <loc>{BASE_URL}/sitemap-{lang}-{i + 1}.xml</loc>
    <lastmod>{datetime.now().date().isoformat()}</lastmod>
  </sitemap>""")
    
    sitemap_index = f"""<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd">
{chr(10).join(sitemaps)}
</sitemapindex>
"""

    save_sitemap(sitemap_index, "sitemap.xml")


async def main():
    """Главная функция"""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("❌ Ошибка: DATABASE_URL не установлен в .env")
        return

    print(f"🔗 Подключение к базе данных...")
    engine = create_async_engine(database_url)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as db:
        print(f"📊 Генерация sitemap для {BASE_URL}\n")

        # 1. Генерируем статический sitemap
        print("1. Генерация sitemap-static.xml...")
        await generate_sitemap_static()

        # 2. Подсчитываем количество компаний и страниц
        count_query = select(func.count(func.distinct(Review.subject)))
        count_result = await db.execute(count_query)
        total_companies = count_result.scalar() or 0
        companies_per_sitemap = 10000
        num_sitemaps = (total_companies + companies_per_sitemap - 1) // companies_per_sitemap if total_companies > 0 else 1

        print(f"\n2. Найдено компаний: {total_companies}")
        print(f"   Количество sitemap файлов: {num_sitemaps}\n")

        # 3. Генерируем sitemap для компаний
        print("3. Генерация sitemap для компаний...")
        generated_count = 0
        for lang in SUPPORTED_LANGS:
            for page in range(1, num_sitemaps + 1):
                if await generate_sitemap_companies(db, lang, page):
                    generated_count += 1
                else:
                    break  # Если нет компаний для этой страницы, останавливаемся

        print(f"\n   Сгенерировано файлов: {generated_count * len(SUPPORTED_LANGS)}")

        # 4. Генерируем главный sitemap index
        print("\n4. Генерация sitemap.xml (index)...")
        await generate_sitemap_index(db)

        print(f"\n✅ Генерация завершена! Все файлы сохранены в {SITEMAP_DIR}/")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())

