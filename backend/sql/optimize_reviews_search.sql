-- Оптимизация поиска по компаниям
-- ВАЖНО: Запустите этот скрипт на продакшене!

-- 1. Включаем расширение pg_trgm для быстрого ILIKE поиска
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. GIN индекс для ILIKE '%...%' поиска (КРИТИЧЕСКИ ВАЖНО для поиска)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_subject_trgm
ON reviews USING gin (subject gin_trgm_ops);

-- 3. Индекс для GROUP BY и ORDER BY subject (КРИТИЧЕСКИ ВАЖНО для пагинации)
-- Этот индекс ускорит GROUP BY subject ORDER BY subject
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_subject_btree
ON reviews (subject);

-- 4. Составной индекс для подсчёта отзывов с комментариями
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_subject_comment
ON reviews (subject, id) WHERE comment IS NOT NULL;

-- 5. Индекс для сортировки по дате внутри компании
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_subject_date
ON reviews (subject, review_date DESC NULLS LAST);

-- 6. Индекс для поиска по reviewer
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_reviewer_trgm
ON reviews USING gin (reviewer gin_trgm_ops);

-- 7. Обновляем статистику
ANALYZE reviews;

-- Проверка что индексы созданы:
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'reviews';
