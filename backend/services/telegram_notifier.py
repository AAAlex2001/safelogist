"""
Сервис для отправки уведомлений в Telegram группу
"""
import os
import aiohttp
import logging
from typing import Optional

logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
GROUP_CHAT_ID = os.getenv("TELEGRAM_GROUP_CHAT_ID")


class TelegramNotifier:
    """Класс для отправки уведомлений в Telegram"""
    
    def __init__(self):
        self.bot_token = BOT_TOKEN
        self.chat_id = GROUP_CHAT_ID
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}"
    
    async def send_message(self, text: str, parse_mode: str = "HTML") -> bool:
        """
        Отправка сообщения в группу
        
        Args:
            text: Текст сообщения
            parse_mode: Режим парсинга (HTML или Markdown)
            
        Returns:
            bool: True если сообщение отправлено успешно
        """
        if not self.bot_token or not self.chat_id:
            logger.warning("Telegram credentials not configured, skipping notification")
            return False
        
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}/sendMessage"
                payload = {
                    "chat_id": self.chat_id,
                    "text": text,
                    "parse_mode": parse_mode
                }
                
                async with session.post(url, json=payload) as response:
                    if response.status == 200:
                        logger.info("Telegram notification sent successfully")
                        return True
                    else:
                        error_text = await response.text()
                        logger.error(f"Failed to send Telegram notification: {error_text}")
                        return False
        except Exception as e:
            logger.error(f"Error sending Telegram notification: {e}")
            return False
    
    async def notify_company_claim(
        self,
        company_name: str,
        user_name: str,
        user_email: str,
        user_phone: str,
        claim_id: int
    ) -> bool:
        """
        Уведомление о новой заявке на подтверждение компании
        """
        text = (
            f"🏢 <b>Новая заявка на подтверждение компании</b>\n\n"
            f"<b>Компания:</b> {company_name}\n"
            f"<b>От:</b> {user_name}\n"
            f"<b>Email:</b> {user_email}\n"
            f"<b>Телефон:</b> {user_phone}\n"
            f"<b>ID заявки:</b> #{claim_id}\n\n"
            f"Проверьте заявку в админ-панели."
        )
        return await self.send_message(text)
    
    async def notify_user_registration(
        self,
        user_name: str,
        user_email: str,
        user_phone: str,
        user_id: int
    ) -> bool:
        """
        Уведомление о новой регистрации пользователя
        """
        text = (
            f"👤 <b>Новая регистрация</b>\n\n"
            f"<b>Имя:</b> {user_name}\n"
            f"<b>Email:</b> {user_email}\n"
            f"<b>Телефон:</b> {user_phone}\n"
            f"<b>ID:</b> #{user_id}"
        )
        return await self.send_message(text)
    
    async def notify_review_request(
        self,
        from_company: str,
        target_company: str,
        rating: int,
        comment: str,
        user_email: str,
        request_id: int
    ) -> bool:
        """
        Уведомление о новой заявке на отзыв
        
        Args:
            from_company: Компания, от имени которой оставляют отзыв
            target_company: Компания, на которую оставляют отзыв
        """
        stars = "⭐" * rating
        comment_preview = comment[:100] + "..." if len(comment) > 100 else comment
        
        text = (
            f"💬 <b>Новая заявка на отзыв</b>\n\n"
            f"<b>От компании:</b> {from_company}\n"
            f"<b>На компанию:</b> {target_company}\n"
            f"<b>Оценка:</b> {stars} ({rating}/5)\n"
            f"<b>Email автора:</b> {user_email}\n"
            f"<b>Комментарий:</b> {comment_preview}\n"
            f"<b>ID заявки:</b> #{request_id}\n\n"
            f"Проверьте заявку в админ-панели."
        )
        return await self.send_message(text)


# Глобальный экземпляр для удобного использования
telegram_notifier = TelegramNotifier()
