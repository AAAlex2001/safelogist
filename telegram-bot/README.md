# Telegram Bot Setup

## Создание бота

1. Найдите @BotFather в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям (название и username)
4. Получите токен бота
5. Настройте Web App:
   ```
   /setmenubutton
   Выберите вашего бота
   Нажмите "Configure menu button"
   text: Открыть SafeLogist
   url: https://safelogist.net
   ```

## Настройка

1. Скопируйте `.env.example` в `.env`:
   ```bash
   cp .env.example .env
   ```

2. Заполните переменные:
   ```env
   TELEGRAM_BOT_TOKEN=ваш_токен_от_BotFather
   WEBAPP_URL=https://safelogist.net
   ```

3. Запустите через Docker Compose:
   ```bash
   docker-compose up -d telegram-bot
   ```

## Команды бота

- `/start` - Приветствие и открытие Web App
- Кнопка "Открыть SafeLogist" - открывает приложение

## Логи

Просмотр логов бота:
```bash
docker logs -f safelogist_telegram_bot
```

## Интеграция с фронтендом

Web App автоматически определяет, что открыт в Telegram и:
- Применяет тему из Telegram
- Получает данные пользователя
- Использует Telegram авторизацию

Хук `useTelegram()` доступен в любом компоненте:
```typescript
const { user, isTelegramWebApp, webApp } = useTelegram();
```
