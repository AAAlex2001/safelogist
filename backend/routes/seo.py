"""
SEO роуты: robots.txt
Sitemap файлы генерируются скриптом generate_sitemap.py и раздаются как статика из /sitemaps/
"""
from fastapi import APIRouter
from fastapi.responses import Response

router = APIRouter(tags=["seo"])


@router.get("/robots.txt", response_class=Response)
async def robots_txt():
    """Файл robots.txt для поисковых систем"""
    content = """User-agent: *
Allow: /
Disallow: /admin/
Disallow: /auth/
Disallow: /api/

Sitemap: https://safelogist.net/sitemaps/sitemap.xml
"""
    return Response(content=content, media_type="text/plain")
