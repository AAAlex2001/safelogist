import aiosmtplib
from email.message import EmailMessage

SMTP_HOST = "smtp.mail.ru"
SMTP_PORT = 587
SMTP_USER = "your_email@mail.ru"
SMTP_PASSWORD = "your_app_password"


async def send_email_code(to_email: str, code: str):
    message = EmailMessage()
    message["From"] = SMTP_USER
    message["To"] = to_email
    message["Subject"] = "Код для восстановления пароля"

    message.set_content(
        f"Ваш код для восстановления пароля: {code}\nОн действует 10 минут."
    )

    await aiosmtplib.send(
        message,
        hostname=SMTP_HOST,
        port=SMTP_PORT,
        start_tls=True,
        username=SMTP_USER,
        password=SMTP_PASSWORD,
    )
