# Docker Deployment Guide

## Быстрый старт

### 1. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# Database Configuration
DB_USER=safelogist
DB_PASSWORD=your_secure_password_here
DB_NAME=safelogist_db
DB_PORT=5432

# Backend Configuration
BACKEND_PORT=8000
SECRET_KEY=your-super-secret-key-change-this-in-production
CORS_ORIGINS=*

# Optional: SQL logging (для разработки)
ECHO_SQL=false
```

### 2. Запуск на локальной машине

```bash
# Сборка и запуск контейнеров
docker-compose up -d

# Просмотр логов
docker-compose logs -f backend

# Остановка
docker-compose down
```

### 3. Деплой на сервер

#### На сервере выполните:

```bash
# Клонируйте репозиторий
git clone <your-repo-url>
cd safelogist/backend

# Создайте .env файл с настройками
nano .env

# Запустите контейнеры
docker-compose up -d --build

# Проверьте статус
docker-compose ps

# Просмотр логов
docker-compose logs -f
```

### 4. Обновление приложения

```bash
# Остановите контейнеры
docker-compose down

# Обновите код
git pull

# Пересоберите и запустите
docker-compose up -d --build
```

### 5. Резервное копирование базы данных

```bash
# Создание бэкапа
docker-compose exec db pg_dump -U safelogist safelogist_db > backup.sql

# Восстановление из бэкапа
docker-compose exec -T db psql -U safelogist safelogist_db < backup.sql
```

## Полезные команды

```bash
# Перезапуск сервисов
docker-compose restart

# Просмотр логов конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f db

# Вход в контейнер бекенда
docker-compose exec backend bash

# Вход в PostgreSQL
docker-compose exec db psql -U safelogist -d safelogist_db

# Очистка (удаление контейнеров и volumes)
docker-compose down -v
```

## Порты

- **Backend API**: http://localhost:8000
- **PostgreSQL**: localhost:5432

## Структура

- `Dockerfile` - образ бекенда
- `docker-compose.yml` - оркестрация сервисов
- `.dockerignore` - файлы, исключаемые из образа
- `requirements.txt` - Python зависимости

