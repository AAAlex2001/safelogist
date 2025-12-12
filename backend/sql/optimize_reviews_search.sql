-- Оптимизация поиска по компаниям
-- Запустите этот скрипт для значительного ускорения поиска

-- 1. Включаем расширение pg_trgm для поддержки LIKE '%...%' с индексами
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. GIN индекс для быстрого поиска по ILIKE '%term%'
-- Это КЛЮЧЕВОЙ индекс для ускорения поиска
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_subject_trgm
ON reviews USING gin (subject gin_trgm_ops);

-- 3. Индекс для поиска по reviewer (также используется в запросах)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_reviewer_trgm
ON reviews USING gin (reviewer gin_trgm_ops);

-- 4. Составной индекс для подсчёта отзывов по компании
-- Ускоряет COUNT(*) WHERE subject = X AND comment IS NOT NULL
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_subject_comment_notnull
ON reviews (subject) WHERE comment IS NOT NULL;

-- 5. Индекс для сортировки отзывов компании по дате
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_subject_date
ON reviews (subject, review_date DESC);

-- 6. Проверяем что базовый индекс на subject существует
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_subject
ON reviews (subject);

-- 7. ANALYZE для обновления статистики
ANALYZE reviews;
