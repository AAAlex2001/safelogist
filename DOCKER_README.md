# Docker Deployment Guide

## Структура проекта

```
safelogist/
├── backend/           # FastAPI приложение
│   └── Dockerfile
├── frontend/          # Next.js приложение
│   └── Dockerfile
└── docker-compose.yml # Orchestration для всех сервисов
```

## Быстрый старт

### 1. Создайте .env файл в корне проекта

```bash
# Database
DB_USER=safelogist
DB_PASSWORD=your_secure_password_here
DB_NAME=safelogist_db
DB_PORT=5432

# Backend
BACKEND_PORT=8000
SECRET_KEY=your_super_secret_key_change_this_in_production
CORS_ORIGINS=http://localhost:3000,https://safelogist.net

# Frontend
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Запустите все сервисы

```bash
# Из корневой папки проекта
docker-compose up -d
```

### 3. Проверьте статус

```bash
docker-compose ps
```

## Отдельные команды

### Пересобрать и запустить

```bash
docker-compose up -d --build
```

### Остановить все сервисы

```bash
docker-compose down
```

### Остановить и удалить volumes (БД будет очищена!)

```bash
docker-compose down -v
```

### Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Только backend
docker-compose logs -f backend

# Только frontend
docker-compose logs -f frontend

# Только database
docker-compose logs -f db
```

### Пересобрать только один сервис

```bash
# Frontend
docker-compose up -d --build frontend

# Backend
docker-compose up -d --build backend
```

## Доступ к сервисам

После запуска сервисы будут доступны по адресам:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Backend Docs**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432

## Production deployment

Для production используйте:

1. Nginx в качестве reverse proxy (конфиг в `nginix/nginx_safelogist.conf`)
2. SSL сертификаты (Let's Encrypt)
3. Измените все пароли и секретные ключи в .env
4. Настройте CORS_ORIGINS на реальные домены

### Пример nginx upstream для docker

```nginx
upstream backend {
    server localhost:8000;
}

upstream frontend {
    server localhost:3000;
}

location / {
    proxy_pass http://frontend;
    # ... остальные proxy настройки
}

location /api {
    proxy_pass http://backend;
    # ... остальные proxy настройки
}
```

## Troubleshooting

### Frontend не может подключиться к Backend

Убедитесь, что `NEXT_PUBLIC_API_URL` правильно настроен:
- Development: `http://localhost:8000`
- Production: `https://api.safelogist.net` или полный URL

### База данных не инициализируется

Проверьте логи:
```bash
docker-compose logs db
```

Если нужно пересоздать базу:
```bash
docker-compose down -v
docker-compose up -d
```

### Порты заняты

Измените порты в .env файле:
```bash
BACKEND_PORT=8001
FRONTEND_PORT=3001
DB_PORT=5433
```

## Health Checks

Backend имеет встроенный health check:
```bash
curl http://localhost:8000/health
```

## Multi-stage Build преимущества

### Frontend (Next.js)
- **Stage 1 (deps)**: Установка production зависимостей
- **Stage 2 (builder)**: Сборка приложения
- **Stage 3 (runner)**: Минимальный production образ (~150MB вместо ~1GB)

### Backend (FastAPI)
- Оптимизированный Python образ на базе slim
- Установка только необходимых системных пакетов

## Полезные команды

```bash
# Проверить размер образов
docker images | grep safelogist

# Очистить неиспользуемые образы
docker image prune -a

# Зайти внутрь контейнера
docker exec -it safelogist_frontend sh
docker exec -it safelogist_backend bash
docker exec -it safelogist_db psql -U safelogist -d safelogist_db
```

