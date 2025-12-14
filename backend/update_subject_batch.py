"""
Батч-обновление subject в таблице reviews
Обновляет по 10,000 строк за раз с коммитами
"""
import asyncio
from database import AsyncSessionLocal
from sqlalchemy import text

BATCH_SIZE = 10000

async def update_subject_batch():
    async with AsyncSessionLocal() as session:
        total_updated = 0
        
        while True:
            # Обновляем батч
            result = await session.execute(
                text("""
                    UPDATE reviews 
                    SET subject = TRIM(REGEXP_REPLACE(
                        REPLACE(REPLACE(subject, ', ', ' '), ',', ' '), 
                        '\\s+', ' ', 'g'
                    ))
                    WHERE id IN (
                        SELECT id 
                        FROM reviews 
                        WHERE subject LIKE '%,%' 
                        LIMIT :batch_size
                        FOR UPDATE SKIP LOCKED
                    )
                """),
                {"batch_size": BATCH_SIZE}
            )
            
            rows_updated = result.rowcount
            await session.commit()
            
            total_updated += rows_updated
            print(f"✅ Обновлено: {rows_updated} строк. Всего: {total_updated}")
            
            if rows_updated == 0:
                print(f"🎉 Готово! Всего обновлено: {total_updated} строк")
                break
            
            # Небольшая пауза между батчами
            await asyncio.sleep(0.1)

if __name__ == "__main__":
    asyncio.run(update_subject_batch())

