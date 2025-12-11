"""
Скрипт для импорта отзывов из JSONL в БД
"""
import json
import asyncio
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from database import AsyncSessionLocal
from models.review import Review


async def import_reviews(jsonl_file_path: str, batch_size: int = 100):
    """
    Импортирует отзывы из JSONL файла в базу данных
    
    Args:
        jsonl_file_path: путь к JSONL файлу
        batch_size: количество записей для вставки за раз
    """
    print(f"📂 Открываем файл: {jsonl_file_path}")
    
    async with AsyncSessionLocal() as session:
        imported = 0
        errors = 0
        batch = []
        
        with open(jsonl_file_path, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                try:
                    data = json.loads(line.strip())
                    
                    # Парсим дату
                    review_date = None
                    if data.get('review_date'):
                        try:
                            review_date = datetime.fromisoformat(data['review_date'].replace('+00:00', '+00:00'))
                        except:
                            pass
                    
                    # Создаем объект
                    review = Review(
                        id=data.get('id'),
                        subject=data.get('subject', ''),
                        review_id=data.get('review_id', ''),
                        comment=data.get('comment'),
                        reviewer=data.get('reviewer'),
                        rating=data.get('rating'),
                        status=data.get('status'),
                        review_date=review_date,
                        source=data.get('source'),
                        jurisdiction=data.get('jurisdiction'),
                        country=data.get('country'),
                        company_number=data.get('company_number'),
                        registration_number=data.get('registration_number'),
                        registration_date=data.get('registration_date'),
                        legal_form=data.get('legal_form'),
                        short_name=data.get('short_name'),
                        cin=data.get('cin'),
                        authorized_capital=data.get('authorized_capital'),
                        paid_up_capital=data.get('paid_up_capital'),
                        subtype=data.get('subtype'),
                        activity_type=data.get('activity_type'),
                        legal_address=data.get('legal_address'),
                        ogrn=data.get('ogrn'),
                        inn=data.get('inn'),
                        liquidation_date=data.get('liquidation_date'),
                        managers=data.get('managers'),
                        branch=data.get('branch'),
                        mailing_address=data.get('mailing_address'),
                    )
                    
                    batch.append(review)
                    
                    # Вставляем батчами
                    if len(batch) >= batch_size:
                        try:
                            session.add_all(batch)
                            await session.commit()
                            imported += len(batch)
                            print(f"✅ Импортировано: {imported}", flush=True)
                            batch = []
                        except Exception as e:
                            await session.rollback()
                            print(f"❌ Ошибка при сохранении батча: {e}")
                            errors += len(batch)
                            batch = []
                            
                except Exception as e:
                    errors += 1
                    if errors < 10:  # Показываем только первые 10 ошибок
                        print(f"❌ Ошибка в строке {line_num}: {e}")
                    continue
        
        # Вставляем оставшиеся записи
        if batch:
            try:
                session.add_all(batch)
                await session.commit()
                imported += len(batch)
                print(f"✅ Импортировано: {imported}")
            except Exception as e:
                await session.rollback()
                print(f"❌ Ошибка при сохранении последнего батча: {e}")
                errors += len(batch)
        
        print(f"\n{'='*50}")
        print(f"✅ Импорт завершён!")
        print(f"✅ Импортировано: {imported}")
        print(f"❌ Ошибок: {errors}")
        print(f"{'='*50}\n")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("❌ Использование: python import_reviews_data.py <путь_к_jsonl_файлу>")
        print("Пример: python import_reviews_data.py reviews_review.jsonl")
        sys.exit(1)
    
    jsonl_path = sys.argv[1]
    
    print("🚀 Начинаем импорт отзывов...")
    asyncio.run(import_reviews(jsonl_path))

