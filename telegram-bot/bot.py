import asyncio
import logging
import os
from dotenv import load_dotenv

from aiogram import Bot, Dispatcher, F
from aiogram.filters import CommandStart
from aiogram.types import Message, WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder

load_dotenv()

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Получение токена и URL из переменных окружения
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://safelogist.net")

if not BOT_TOKEN:
    raise ValueError("TELEGRAM_BOT_TOKEN не установлен в переменных окружения")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()


@dp.message(CommandStart())
async def cmd_start(message: Message):
    """Обработчик команды /start"""
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


@dp.message(F.text == "📱 Открыть приложение")
async def open_webapp(message: Message):
    """Открытие Web App по текстовой команде"""
    builder = InlineKeyboardBuilder()
    builder.button(
        text="🚀 Открыть SafeLogist",
        web_app=WebAppInfo(url=WEBAPP_URL)
    )
    
    await message.answer(
        "Нажмите кнопку ниже для открытия приложения:",
        reply_markup=builder.as_markup()
    )


@dp.message(F.text)
async def echo_message(message: Message):
    """Ответ на любые текстовые сообщения"""
    await message.answer(
        "Для работы с SafeLogist используйте команду /start\n"
        "или нажмите кнопку открытия приложения."
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
