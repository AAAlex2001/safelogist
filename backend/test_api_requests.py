"""
Скрипт для тестирования API запросов:
- Автокомплит поиска компаний
- Получение страниц с отзывами компаний
"""
import asyncio
import httpx
import time
from typing import List, Dict, Optional
from urllib.parse import quote


# Настройки
BASE_URL = "https://safelogist.net"  # Базовый URL API
LANG = "ru"  # Язык: ru, en, uk, ro
REQUESTS_PER_SECOND = 10  # Максимальное количество запросов в секунду


async def autocomplete_search(
    client: httpx.AsyncClient,
    query: str,
    limit: int = 10
) -> Dict:
    """
    Запрос автокомплита для поиска компаний
    
    Args:
        client: httpx клиент
        query: Поисковый запрос
        limit: Максимальное количество результатов
        
    Returns:
        Словарь с результатами поиска
    """
    url = f"{BASE_URL}/api/reviews/search"
    params = {
        "q": query,
        "limit": limit
    }
    
    try:
        response = await client.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            return {
                "success": True,
                "query": query,
                "companies": data.get("companies", []),
                "count": len(data.get("companies", []))
            }
        else:
            return {
                "success": False,
                "query": query,
                "status": response.status_code,
                "error": response.text
            }
    except Exception as e:
        return {
            "success": False,
            "query": query,
            "error": str(e)
        }


async def get_reviews_list_page(
    client: httpx.AsyncClient,
    page: int = 1,
    lang: str = LANG
) -> Dict:
    """
    Получение HTML страницы со списком компаний
    
    Args:
        client: httpx клиент
        page: Номер страницы
        lang: Язык интерфейса
        
    Returns:
        Словарь с результатом запроса
    """
    url = f"{BASE_URL}/{lang}/reviews"
    params = {"page": page}
    
    try:
        response = await client.get(url, params=params)
        if response.status_code == 200:
            html = response.text
            return {
                "success": True,
                "page": page,
                "type": "list",
                "status": response.status_code,
                "html_length": len(html),
                "url": str(response.url)
            }
        else:
            return {
                "success": False,
                "page": page,
                "type": "list",
                "status": response.status_code,
                "error": response.text
            }
    except Exception as e:
        return {
            "success": False,
            "page": page,
            "type": "list",
            "error": str(e)
        }


async def get_company_reviews_page(
    client: httpx.AsyncClient,
    company_id: int,
    page: int = 1,
    lang: str = LANG
) -> Dict:
    """
    Получение HTML страницы с отзывами компании
    
    Args:
        client: httpx клиент
        company_id: ID компании
        page: Номер страницы
        lang: Язык интерфейса
        
    Returns:
        Словарь с результатом запроса
    """
    url = f"{BASE_URL}/{lang}/reviews/item/{company_id}"
    params = {"page": page}
    
    try:
        response = await client.get(url, params=params)
        if response.status_code == 200:
            html = response.text
            return {
                "success": True,
                "company_id": company_id,
                "page": page,
                "status": response.status_code,
                "html_length": len(html),
                "url": str(response.url)
            }
        else:
            return {
                "success": False,
                "company_id": company_id,
                "page": page,
                "status": response.status_code,
                "error": response.text
            }
    except Exception as e:
        return {
            "success": False,
            "company_id": company_id,
            "page": page,
            "error": str(e)
        }


class RateLimiter:
    """Ограничитель скорости запросов"""
    def __init__(self, rate: float):
        self.rate = rate  # запросов в секунду
        self.allowance = rate
        self.last_check = time.time()
        self.lock = asyncio.Lock()
    
    async def acquire(self):
        """Ожидание разрешения на выполнение запроса"""
        async with self.lock:
            current = time.time()
            time_passed = current - self.last_check
            self.last_check = current
            self.allowance += time_passed * self.rate
            
            if self.allowance > self.rate:
                self.allowance = self.rate
            
            if self.allowance < 1.0:
                sleep_time = (1.0 - self.allowance) / self.rate
                await asyncio.sleep(sleep_time)
                self.allowance = 0.0
            else:
                self.allowance -= 1.0


async def load_page_with_stats(
    client: httpx.AsyncClient,
    company_id: int,
    page: int,
    semaphore: asyncio.Semaphore,
    request_num: int,
    total_requests: int
) -> Dict:
    """Загрузка страницы компании с ограничением параллелизма"""
    async with semaphore:
        start_time = time.time()
        result = await get_company_reviews_page(client, company_id, page)
        elapsed = time.time() - start_time
        
        result["request_num"] = request_num
        result["total_requests"] = total_requests
        result["elapsed"] = elapsed
        
        return result


async def load_list_page_with_stats(
    client: httpx.AsyncClient,
    page: int,
    semaphore: asyncio.Semaphore,
    request_num: int,
    total_requests: int
) -> Dict:
    """Загрузка страницы списка компаний с ограничением параллелизма"""
    async with semaphore:
        start_time = time.time()
        result = await get_reviews_list_page(client, page)
        elapsed = time.time() - start_time
        
        result["request_num"] = request_num
        result["total_requests"] = total_requests
        result["elapsed"] = elapsed
        
        return result


async def test_autocomplete_queries(
    client: httpx.AsyncClient,
    queries: List[str],
    rate_limiter: Optional[RateLimiter] = None
):
    """
    Тестирование автокомплита с несколькими запросами
    
    Args:
        client: httpx клиент
        queries: Список поисковых запросов
        rate_limiter: Ограничитель скорости запросов
    """
    print("\n" + "="*60)
    print("ТЕСТИРОВАНИЕ АВТОКОМПЛИТА")
    print("="*60)
    
    results = []
    total_start = time.time()
    
    for i, query in enumerate(queries, 1):
        if rate_limiter:
            await rate_limiter.acquire()
        
        print(f"\n🔍 Поиск {i}/{len(queries)}: '{query}'")
        start_time = time.time()
        result = await autocomplete_search(client, query)
        elapsed = time.time() - start_time
        
        if result["success"]:
            print(f"✅ Найдено компаний: {result['count']}")
            if result["companies"]:
                print("   Примеры:")
                for j, company in enumerate(result["companies"][:3], 1):
                    print(f"   {j}. {company.get('name', 'N/A')} (ID: {company.get('id', 'N/A')})")
        else:
            print(f"❌ Ошибка: {result.get('error', result.get('status', 'Unknown'))}")
        
        print(f"⏱️  Время: {elapsed:.2f}с")
        results.append(result)
    
    total_elapsed = time.time() - total_start
    
    # Статистика
    successful = sum(1 for r in results if r["success"])
    total_companies = sum(r.get("count", 0) for r in results if r["success"])
    avg_time = total_elapsed / len(queries) if queries else 0
    actual_rate = len(queries) / total_elapsed if total_elapsed > 0 else 0
    
    print("\n" + "-"*60)
    print(f"📊 Статистика:")
    print(f"   Успешных запросов: {successful}/{len(queries)}")
    print(f"   Всего найдено компаний: {total_companies}")
    print(f"   Общее время: {total_elapsed:.2f}с")
    print(f"   Среднее время на запрос: {avg_time:.2f}с")
    print(f"   Фактическая скорость: {actual_rate:.2f} запросов/сек")
    print("-"*60)
    
    return results


async def test_company_pages(
    client: httpx.AsyncClient,
    company_ids: List[int],
    pages: List[int] = None,
    rate_limiter: Optional[RateLimiter] = None
):
    """
    Тестирование получения страниц компаний
    
    Args:
        client: httpx клиент
        company_ids: Список ID компаний
        pages: Список номеров страниц (по умолчанию [1])
        rate_limiter: Ограничитель скорости запросов
    """
    if pages is None:
        pages = [1]
    
    print("\n" + "="*60)
    print("ТЕСТИРОВАНИЕ СТРАНИЦ КОМПАНИЙ")
    print("="*60)
    
    results = []
    total_start = time.time()
    total_requests = len(company_ids) * len(pages)
    request_num = 0
    
    for company_id in company_ids:
        for page in pages:
            request_num += 1
            if rate_limiter:
                await rate_limiter.acquire()
            
            print(f"\n📄 Запрос {request_num}/{total_requests}: Компания ID: {company_id}, Страница: {page}")
            start_time = time.time()
            result = await get_company_reviews_page(client, company_id, page)
            elapsed = time.time() - start_time
            
            if result["success"]:
                print(f"✅ Успешно загружено")
                print(f"   Размер HTML: {result['html_length']:,} байт")
            else:
                print(f"❌ Ошибка: {result.get('error', result.get('status', 'Unknown'))}")
            
            print(f"⏱️  Время: {elapsed:.2f}с")
            results.append(result)
    
    total_elapsed = time.time() - total_start
    
    # Статистика
    successful = sum(1 for r in results if r["success"])
    avg_time = total_elapsed / len(results) if results else 0
    actual_rate = len(results) / total_elapsed if total_elapsed > 0 else 0
    
    print("\n" + "-"*60)
    print(f"📊 Статистика:")
    print(f"   Успешных запросов: {successful}/{len(results)}")
    print(f"   Общее время: {total_elapsed:.2f}с")
    print(f"   Среднее время на запрос: {avg_time:.2f}с")
    print(f"   Фактическая скорость: {actual_rate:.2f} запросов/сек")
    print("-"*60)
    
    return results


async def test_combined_flow(
    client: httpx.AsyncClient,
    search_query: str,
    rate_limiter: Optional[RateLimiter] = None
):
    """
    Комбинированный тест: поиск через автокомплит, затем получение страниц найденных компаний
    
    Args:
        client: httpx клиент
        search_query: Поисковый запрос
        rate_limiter: Ограничитель скорости запросов
    """
    print("\n" + "="*60)
    print(f"КОМБИНИРОВАННЫЙ ТЕСТ: '{search_query}'")
    print("="*60)
    
    # 1. Поиск через автокомплит
    if rate_limiter:
        await rate_limiter.acquire()
    print(f"\n1️⃣ Поиск компаний: '{search_query}'")
    autocomplete_result = await autocomplete_search(client, search_query, limit=5)
    
    if not autocomplete_result["success"] or not autocomplete_result["companies"]:
        print("❌ Компании не найдены")
        return
    
    companies = autocomplete_result["companies"]
    print(f"✅ Найдено {len(companies)} компаний")
    
    # 2. Получение страниц для каждой компании
    print(f"\n2️⃣ Загрузка страниц компаний...")
    for i, company in enumerate(companies, 1):
        company_id = company.get("id")
        company_name = company.get("name", "N/A")
        
        if not company_id:
            print(f"   {i}. {company_name} - пропущено (нет ID)")
            continue
        
        if rate_limiter:
            await rate_limiter.acquire()
        
        print(f"   {i}. {company_name} (ID: {company_id})")
        result = await get_company_reviews_page(client, company_id, page=1)
        
        if result["success"]:
            print(f"      ✅ Страница загружена ({result['html_length']:,} байт)")
        else:
            print(f"      ❌ Ошибка: {result.get('error', result.get('status', 'Unknown'))}")


async def get_companies_dynamically(
    client: httpx.AsyncClient,
    search_queries: Optional[List[str]] = None,
    companies_per_query: int = 5,
    max_total_companies: int = 20,
    num_queries: int = 10
) -> List[Dict]:
    """
    Динамически получает список компаний через автокомплит
    
    Args:
        client: httpx клиент
        search_queries: Список поисковых запросов (если None - генерируются автоматически)
        companies_per_query: Количество компаний на запрос
        max_total_companies: Максимальное общее количество компаний
        num_queries: Количество запросов для генерации (если search_queries не указан)
        
    Returns:
        Список словарей с информацией о компаниях {id, name}
    """
    import random
    import string
    
    # Если запросы не указаны, генерируем разнообразные
    if search_queries is None:
        # Базовые популярные запросы
        base_queries = [
            "ТОВ", "ООО", "ИП", "ФОП", "Логистик", "Транспорт", 
            "Перевозка", "Экспедиция", "Груз", "Доставка",
            "Сервис", "Компания", "Транс", "Логист"
        ]
        
        # Генерируем дополнительные случайные запросы
        # Буквы для генерации
        letters_ru = "абвгдежзийклмнопрстуфхцчшщъыьэюя"
        letters_en = "abcdefghijklmnopqrstuvwxyz"
        
        # Генерируем случайные 2-3 буквенные комбинации
        random_queries = []
        for _ in range(num_queries - len(base_queries)):
            # Случайно выбираем русские или английские буквы
            if random.random() > 0.5:
                letters = letters_ru
            else:
                letters = letters_en
            
            # Генерируем 2-3 буквы
            length = random.randint(2, 3)
            query = ''.join(random.choice(letters) for _ in range(length))
            random_queries.append(query.upper() if random.random() > 0.5 else query)
        
        search_queries = base_queries + random_queries[:num_queries - len(base_queries)]
        # Перемешиваем для разнообразия
        random.shuffle(search_queries)
        search_queries = search_queries[:num_queries]
    
    all_companies = []
    semaphore = asyncio.Semaphore(REQUESTS_PER_SECOND)
    
    async def fetch_companies(query: str):
        async with semaphore:
            result = await autocomplete_search(client, query, limit=companies_per_query)
            if result["success"] and result["companies"]:
                return result["companies"]
            return []
    
    # Запускаем все запросы параллельно
    print(f"🔍 Поиск компаний по {len(search_queries)} запросам...")
    print(f"   Запросы: {', '.join(search_queries[:10])}{'...' if len(search_queries) > 10 else ''}")
    coroutines = [fetch_companies(query) for query in search_queries]
    results = await asyncio.gather(*coroutines)
    
    # Собираем все компании
    for companies in results:
        all_companies.extend(companies)
    
    # Убираем дубликаты по ID
    unique_companies = {}
    for company in all_companies:
        company_id = company.get("id")
        if company_id and company_id not in unique_companies:
            unique_companies[company_id] = company
    
    # Ограничиваем количество
    companies_list = list(unique_companies.values())[:max_total_companies]
    
    print(f"✅ Найдено {len(companies_list)} уникальных компаний")
    return companies_list


async def get_company_pages_count(
    client: httpx.AsyncClient,
    company_id: int,
    lang: str = LANG
) -> int:
    """
    Определяет количество страниц для компании (загружая первую страницу)
    
    Args:
        client: httpx клиент
        company_id: ID компании
        lang: Язык интерфейса
        
    Returns:
        Количество страниц (или 1 если не удалось определить)
    """
    try:
        url = f"{BASE_URL}/{lang}/reviews/item/{company_id}"
        params = {"page": 1}
        response = await client.get(url, params=params, follow_redirects=True)
        
        if response.status_code == 200:
            html = response.text
            # Ищем паттерн "Страница 1 / X" или "page 1 / X"
            import re
            patterns = [
                r'Страница\s+\d+\s+/\s+(\d+)',
                r'page\s+\d+\s+/\s+(\d+)',
                r'страница\s+\d+\s+из\s+(\d+)',
            ]
            
            for pattern in patterns:
                match = re.search(pattern, html, re.IGNORECASE)
                if match:
                    return int(match.group(1))
        
        # Если не нашли, возвращаем 1 (минимум одна страница)
        return 1
    except Exception:
        return 1


async def main():
    """Главная функция"""
    print("🚀 Запуск тестирования API")
    print(f"📍 Базовый URL: {BASE_URL}")
    print(f"🌐 Язык: {LANG}")
    print(f"⚡ Параллельных запросов: {REQUESTS_PER_SECOND} (как {REQUESTS_PER_SECOND} пользователей одновременно)")
    
    # Создаем клиент
    limits = httpx.Limits(max_keepalive_connections=20, max_connections=20)
    timeout = httpx.Timeout(30.0)
    
    async with httpx.AsyncClient(timeout=timeout, limits=limits) as client:
        # Динамически получаем компании (запросы генерируются автоматически)
        companies = await get_companies_dynamically(
            client,
            search_queries=None,  # None = автоматическая генерация разнообразных запросов
            companies_per_query=5,
            max_total_companies=20,
            num_queries=15  # Количество различных запросов
        )
        
        if not companies:
            print("❌ Не удалось найти компании для тестирования")
            return
        
        print(f"\n📋 Компании для тестирования:")
        for i, company in enumerate(companies[:10], 1):
            print(f"   {i}. {company.get('name', 'N/A')} (ID: {company.get('id', 'N/A')})")
        if len(companies) > 10:
            print(f"   ... и еще {len(companies) - 10} компаний")
        
        # Определяем количество страниц для каждой компании (параллельно)
        print(f"\n📄 Определение количества страниц для каждой компании...")
        semaphore = asyncio.Semaphore(REQUESTS_PER_SECOND)
        
        async def get_pages_for_company(company: Dict):
            async with semaphore:
                company_id = company.get("id")
                if not company_id:
                    return None
                pages_count = await get_company_pages_count(client, company_id)
                return {
                    "company_id": company_id,
                    "company_name": company.get("name", "N/A"),
                    "pages_count": min(pages_count, 10)  # Ограничиваем максимум 10 страницами
                }
        
        companies_with_pages = await asyncio.gather(*[
            get_pages_for_company(company) for company in companies
        ])
        
        # Фильтруем None (компании без ID)
        companies_with_pages = [c for c in companies_with_pages if c is not None]
        
        # Создаем список всех задач (компания + страница)
        tasks = []
        for company_info in companies_with_pages:
            company_id = company_info["company_id"]
            pages_count = company_info["pages_count"]
            for page in range(1, pages_count + 1):
                tasks.append((company_id, page, company_info["company_name"]))
        
        total_requests = len(tasks)
        print(f"✅ Найдено {len(companies_with_pages)} компаний с {total_requests} страницами")
        print(f"🔄 Параллельно: {REQUESTS_PER_SECOND} запросов одновременно")
    
        # Добавляем страницы списка компаний (до 500-й страницы)
        list_pages = list(range(1, 501))  # Страницы 1-500
        list_tasks = [(page, "list") for page in list_pages]
        
        total_list_requests = len(list_tasks)
        total_company_requests = len(tasks)
        total_all_requests = total_company_requests + total_list_requests
        
        print(f"\n📋 Итого задач:")
        print(f"   Страницы компаний: {total_company_requests}")
        print(f"   Страницы списка: {total_list_requests}")
        print(f"   Всего запросов: {total_all_requests}")
        
        if total_all_requests == 0:
            print("❌ Нет страниц для загрузки")
            return
        
        # Создаем семафор для ограничения параллелизма
        semaphore = asyncio.Semaphore(REQUESTS_PER_SECOND)
        
        total_start = time.time()
        
        # Создаем все задачи параллельно
        print(f"\n🚀 Запуск {total_all_requests} запросов параллельно...\n")
        
        async def process_company_task(company_id: int, page: int, company_name: str, task_num: int):
            """Обработка задачи загрузки страницы компании"""
            result = await load_page_with_stats(
                client, company_id, page, semaphore, task_num, total_all_requests
            )
            
            # Выводим результат сразу после завершения
            status = "✅" if result["success"] else "❌"
            size_info = f"{result['html_length']:,} байт" if result["success"] else ""
            error_info = result.get('error', result.get('status', '')) if not result["success"] else ""
            info = size_info if result["success"] else error_info
            
            # Сокращаем название компании для вывода
            name_short = company_name[:20] + "..." if len(company_name) > 20 else company_name
            
            print(f"{status} [C{task_num:4d}/{total_all_requests}] {name_short} P:{page} {info} ({result['elapsed']:.2f}с)")
            
            return result
        
        async def process_list_task(page: int, task_num: int):
            """Обработка задачи загрузки страницы списка"""
            result = await load_list_page_with_stats(
                client, page, semaphore, task_num, total_all_requests
            )
            
            # Выводим результат сразу после завершения
            status = "✅" if result["success"] else "❌"
            size_info = f"{result['html_length']:,} байт" if result["success"] else ""
            error_info = result.get('error', result.get('status', '')) if not result["success"] else ""
            info = size_info if result["success"] else error_info
            
            print(f"{status} [L{task_num:4d}/{total_all_requests}] Список P:{page} {info} ({result['elapsed']:.2f}с)")
            
            return result
        
        # Создаем корутины для всех задач
        coroutines = []
        task_counter = 1
        
        # Добавляем задачи для страниц компаний
        for company_id, page, company_name in tasks:
            coroutines.append(process_company_task(company_id, page, company_name, task_counter))
            task_counter += 1
        
        # Добавляем задачи для страниц списка
        for page, _ in list_tasks:
            coroutines.append(process_list_task(page, task_counter))
            task_counter += 1
        
        results = await asyncio.gather(*coroutines)
        
        total_elapsed = time.time() - total_start
        
        # Итоговая статистика
        successful = sum(1 for r in results if r["success"])
        failed = len(results) - successful
        avg_time = sum(r["elapsed"] for r in results) / len(results) if results else 0
        min_time = min(r["elapsed"] for r in results) if results else 0
        max_time = max(r["elapsed"] for r in results) if results else 0
        actual_rate = len(results) / total_elapsed if total_elapsed > 0 else 0
        
        print("\n" + "="*60)
        print("📊 ИТОГОВАЯ СТАТИСТИКА")
        print("="*60)
        print(f"   Всего запросов: {len(results)}")
        print(f"   Успешных: {successful}")
        print(f"   Ошибок: {failed}")
        print(f"   Общее время: {total_elapsed:.2f}с")
        print(f"   Среднее время на запрос: {avg_time:.2f}с")
        print(f"   Минимальное время: {min_time:.2f}с")
        print(f"   Максимальное время: {max_time:.2f}с")
        print(f"   Фактическая скорость: {actual_rate:.2f} запросов/сек")
        print(f"   Параллельных запросов: {REQUESTS_PER_SECOND}")
        if total_requests > 0 and total_elapsed > 0:
            theoretical_time = total_requests / REQUESTS_PER_SECOND
            speedup = theoretical_time / total_elapsed if total_elapsed > 0 else 0
            print(f"   Ускорение (vs последовательно): {speedup:.2f}x")
        print("="*60)
    
    print("\n✅ Тестирование завершено")


if __name__ == "__main__":
    # Запуск асинхронного кода
    asyncio.run(main())

