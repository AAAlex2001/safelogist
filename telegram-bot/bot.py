import asyncio
import logging
import os
from dotenv import load_dotenv

from aiogram import Bot, Dispatcher, F
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, WebAppInfo, ReplyKeyboardMarkup, KeyboardButton, ChatType
from aiogram.utils.keyboard import InlineKeyboardBuilder

load_dotenv()

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Получение токена и URL из переменных окружения
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://safelogist.net")
CHANNEL_URL = "https://t.me/safelogist"
GROUP_CHAT_ID = os.getenv("TELEGRAM_GROUP_CHAT_ID")

if not BOT_TOKEN:
    raise ValueError("TELEGRAM_BOT_TOKEN не установлен в переменных окружения")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()


def is_allowed_chat(message: Message) -> bool:
    """Проверяет, разрешен ли чат для обработки команд"""
    # Разрешаем личные сообщения
    if message.chat.type == ChatType.PRIVATE:
        return True
    # Разрешаем чат из .env
    if GROUP_CHAT_ID and str(message.chat.id) == str(GROUP_CHAT_ID):
        return True
    return False

# Главная клавиатура с командами
main_keyboard = ReplyKeyboardMarkup(
    if not is_allowed_chat(message):
        return
    
    user = message.from_user
    
    # Создаем клавиатуру с Web App
    builder = InlineKeyboardBuilder()
    builder.button(
        text="🚀 Открыть SafeLogist",
        web_app=WebAppInfo(url=WEBAPP_URL)
    )
    
    await message.answer(
        f"👋 Привет, {user.first_name}!\n\n"
        f"Добро пожаловать в <b>SafeLogist</b> — платформу проверки логистических компаний.\n\n"
        f"🔍 <b>Что вы можете делать:</b>\n"
        f"• Искать отзывы о компаниях\n"
        f"• Оставлять свои отзывы\n"
        f"• Подтверждать владение компанией\n"
        f"• Управлять профилем\n\n"
        f"Нажмите кнопку ниже, чтобы открыть приложение:",
        reply_markup=builder.as_markup(),
        parse_mode="HTML"
    )


@dp.message(Command("channel"))
async def cmd_channel(message: Message):
    """Обработчик команды /channel - ссылка на Telegram канал"""
    if not is_allowed_chat(message):
        return
    
        f"• Оставлять свои отзывы\n"
        f"• Подтверждать владение компанией\n"
        f"• Управлять профилем\n\n"
        f"Нажмите кнопку ниже, чтобы открыть приложение:",
        reply_markup=builder.as_markup(),
        parse_mode="HTML"
    )


@dp.message(Command("channel"))
async def cmd_channel(message: Message):
    """Обработчик команды /channel - ссылка на Telegram канал"""
    await message.answer(
        f"📢 <b>Наш Telegram канал</b>\n\n"
        f"Подписывайтесь на наш канал, чтобы быть в курсе всех новостей и обновлений SafeLogist:\n\n"
        f"👉 {CHANNEL_URL}\n\n"
        f"Там мы публикуем:\n"
        f"• Новости платформы\n"
        f"• Советы по проверке компаний\n"
        f"• Важные обновления\n"
        f"• Статистику и аналитику",
        parse_mode="HTML"
    )


async def main():
    """Основная функция запуска бота"""
    logger.info("Запуск Telegram бота SafeLogist...")
    logger.info(f"Web App URL: {WEBAPP_URL}")
    
    # Удаляем webhook если был установлен
    await bot.delete_webhook(drop_pending_updates=True)
    
    # Запускаем polling
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
