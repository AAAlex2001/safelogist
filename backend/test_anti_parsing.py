"""
Тестовый скрипт для проверки защиты от парсинга
"""
import requests

BASE_URL = "https://safelogist.net"

def test_user_access():
    """Тест доступа обычного пользователя"""
    print("=== Тест обычного пользователя ===")
    
    # Страница 1 - должна работать
    response = requests.get(f"{BASE_URL}/ru/reviews?page=1")
    print(f"Страница 1: {response.status_code} (ожидается 200)")
    
    # Страница 50 - должна работать
    response = requests.get(f"{BASE_URL}/ru/reviews?page=50")
    print(f"Страница 50: {response.status_code} (ожидается 200)")
    
    # Страница 100 - должна работать
    response = requests.get(f"{BASE_URL}/ru/reviews?page=100")
    print(f"Страница 100: {response.status_code} (ожидается 200)")
    
    # Страница 101 - должна быть заблокирована
    response = requests.get(f"{BASE_URL}/ru/reviews?page=101")
    print(f"Страница 101: {response.status_code} (ожидается 403)")
    print(f"Содержит 'недоступна': {'недоступна' in response.text}")
    
    # Страница 500 - должна быть заблокирована
    response = requests.get(f"{BASE_URL}/ru/reviews?page=500")
    print(f"Страница 500: {response.status_code} (ожидается 403)")


def test_bot_access():
    """Тест доступа поискового бота"""
    print("\n=== Тест поискового бота (Googlebot) ===")
    
    headers = {'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'}
    
    # Страница 1 - должна работать
    response = requests.get(f"{BASE_URL}/ru/reviews?page=1", headers=headers)
    print(f"Страница 1: {response.status_code} (ожидается 200)")
    
    # Страница 101 - должна работать для бота
    response = requests.get(f"{BASE_URL}/ru/reviews?page=101", headers=headers)
    print(f"Страница 101: {response.status_code} (ожидается 200)")
    
    # Страница 500 - должна работать для бота
    response = requests.get(f"{BASE_URL}/ru/reviews?page=500", headers=headers)
    print(f"Страница 500: {response.status_code} (ожидается 200)")


def test_yandex_bot():
    """Тест доступа Яндекс бота"""
    print("\n=== Тест поискового бота (YandexBot) ===")
    
    headers = {'User-Agent': 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)'}
    
    # Страница 200 - должна работать для бота
    response = requests.get(f"{BASE_URL}/ru/reviews?page=200", headers=headers)
    print(f"Страница 200: {response.status_code} (ожидается 200)")


def test_search_api():
    """Тест API поиска - должен работать без ограничений"""
    print("\n=== Тест API поиска ===")
    
    response = requests.get(f"{BASE_URL}/api/reviews/search?q=логистика&limit=50")
    print(f"API поиска: {response.status_code} (ожидается 200)")
    if response.status_code == 200:
        data = response.json()
        print(f"Найдено компаний: {len(data.get('companies', []))}")


if __name__ == "__main__":
    print("Запуск тестов защиты от парсинга...\n")
    
    try:
        test_user_access()
        test_bot_access()
        test_yandex_bot()
        test_search_api()
        print("\n✅ Все тесты завершены!")
    except Exception as e:
        print(f"\n❌ Ошибка при выполнении тестов: {e}")
