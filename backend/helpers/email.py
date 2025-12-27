import os
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Environment, FileSystemLoader, select_autoescape
from pathlib import Path
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.mail.ru")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "465"))
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")

if not EMAIL_HOST_USER or not EMAIL_HOST_PASSWORD:
    raise RuntimeError("EMAIL_HOST_USER or EMAIL_HOST_PASSWORD is not set in environment")

# Настройка Jinja2 для email шаблонов
TEMPLATES_DIR = Path(__file__).parent.parent / "templates" / "emails"
env = Environment(
    loader=FileSystemLoader(str(TEMPLATES_DIR)),
    autoescape=select_autoescape(['html', 'xml'])
)

async def send_email_code(to_email: str, code: str) -> None:
    """Отправляет письмо с кодом восстановления пароля (HTML + текстовая версия)"""

    message = MIMEMultipart("alternative")
    message["From"] = EMAIL_HOST_USER
    message["To"] = to_email
    message["Subject"] = "Код для восстановления пароля"

    # Рендерим HTML шаблон
    template = env.get_template("password_reset.html")
    html_body = template.render(code=code)

    # Текстовая версия (fallback)
    text_body = f"Ваш код для восстановления пароля: {code}\nОн действует 10 минут."

    # Добавляем обе версии
    message.attach(MIMEText(text_body, "plain", "utf-8"))
    message.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        await aiosmtplib.send(
            message,
            hostname=EMAIL_HOST,
            port=EMAIL_PORT,
            username=EMAIL_HOST_USER,
            password=EMAIL_HOST_PASSWORD,
            use_tls=True,
            source_address=("0.0.0.0", 0),
        )

        print(f"✅ Email успешно отправлен на {to_email}")

    except Exception as e:
        print(f"❌ Ошибка при отправке email: {str(e)}")
        raise


async def send_account_credentials(
    to_email: str,
    name: str,
    company_name: str,
    password: str
) -> None:
    """Отправляет письмо с данными для входа в новую учетную запись"""

    message = MIMEMultipart("alternative")
    message["From"] = EMAIL_HOST_USER
    message["To"] = to_email
    message["Subject"] = "Ваша учетная запись SafeLogist создана"

    # Рендерим HTML шаблон
    template = env.get_template("account_created.html")
    html_body = template.render(
        name=name,
        company_name=company_name,
        email=to_email,
        password=password
    )

    # Текстовая версия (fallback)
    text_body = f"""Здравствуйте, {name}!

Ваша заявка на подтверждение компании "{company_name}" была одобрена.
Для вас была создана учетная запись в системе SafeLogist.

Данные для входа:
Логин (Email): {to_email}
Временный пароль: {password}

После первого входа мы настоятельно рекомендуем изменить пароль в настройках профиля.

Войти в систему: https://safelogist.net/ru/login

---
If у вас возникли вопросы, свяжитесь с нами: info@safelogist.net
© 2025 SafeLogist. Все права защищены.
"""

    # Добавляем обе версии
    message.attach(MIMEText(text_body, "plain", "utf-8"))
    message.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        await aiosmtplib.send(
            message,
            hostname=EMAIL_HOST,
            port=EMAIL_PORT,
            username=EMAIL_HOST_USER,
            password=EMAIL_HOST_PASSWORD,
            use_tls=True,
            source_address=("0.0.0.0", 0),
        )

        print(f"✅ Email с учетными данными успешно отправлен на {to_email}")

    except Exception as e:
        print(f"❌ Ошибка при отправке email: {str(e)}")
        raise