-- Скрипт обновления статистики компаний
-- Запускать периодически (cron раз в час/день)

-- 1. Добавляем колонки если их нет
ALTER TABLE companies ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS min_review_id INTEGER;

-- 2. Создаём индекс на min_review_id если нет
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_min_review_id
ON companies (min_review_id);

-- 3. Обновляем статистику для всех компаний
-- Используем подзапрос для эффективности
UPDATE companies c
SET
    reviews_count = stats.cnt,
    min_review_id = stats.min_id
FROM (
    SELECT
        subject,
        COUNT(*) FILTER (WHERE comment IS NOT NULL) as cnt,
        MIN(id) as min_id
    FROM reviews
    GROUP BY subject
) stats
WHERE c.name = stats.subject;

-- 4. Добавляем новые компании которых ещё нет в таблице
INSERT INTO companies (name, reviews_count, min_review_id)
SELECT
    subject,
    COUNT(*) FILTER (WHERE comment IS NOT NULL),
    MIN(id)
FROM reviews
WHERE subject NOT IN (SELECT name FROM companies)
GROUP BY subject
ON CONFLICT (name) DO NOTHING;

-- 5. Обновляем статистику таблицы
ANALYZE companies;
