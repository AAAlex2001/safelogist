"""
Настройка SQLAdmin панели
"""
import os
from sqladmin import Admin, ModelView
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request

from database import engine
from models.user import User
from models.forgot_password import PasswordResetCode


class AdminAuth(AuthenticationBackend):
    """
    Простая аутентификация для админ панели
    """
    async def login(self, request: Request) -> bool:
        form = await request.form()
        username = form.get("username")
        password = form.get("password")
        
        # Получаем учетные данные из переменных окружения
        admin_username = os.getenv("ADMIN_USERNAME")
        admin_password = os.getenv("ADMIN_PASSWORD")
        
        if username == admin_username and password == admin_password:
            request.session.update({"authenticated": True})
            return True
        return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        return request.session.get("authenticated", False)


# Админка будет создана после инициализации app
admin = None


class UserAdmin(ModelView, model=User):
    """
    Админ панель для управления пользователями
    """
    name = "Пользователь"
    name_plural = "Пользователи"
    icon = "fa-solid fa-users"
    
    column_list = [
        User.id,
        User.name,
        User.email,
        User.phone,
        User.role,
        User.is_active,
        User.company_name,
        User.created_at,
    ]
    # Пароль не включен в column_list (безопасность)
    
    column_searchable_list = [User.email, User.name, User.phone]
    column_sortable_list = [User.id, User.created_at, User.email]
    column_default_sort = [(User.id, True)]
    
    form_columns = [
        User.name,
        User.email,
        User.phone,
        User.role,
        User.is_active,
        User.company_name,
        User.position,
        User.location,
        User.photo,
    ]
    # Пароль, password_reset_codes, created_at, updated_at не включены в form_columns (безопасность)
    
    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True


class PasswordResetCodeAdmin(ModelView, model=PasswordResetCode):
    """
    Админ панель для управления кодами восстановления
    """
    name = "Код восстановления"
    name_plural = "Коды восстановления"
    icon = "fa-solid fa-key"
    
    column_list = [
        PasswordResetCode.id,
        PasswordResetCode.user_id,
        PasswordResetCode.code,
        PasswordResetCode.expires_at,
    ]
    
    column_searchable_list = [PasswordResetCode.code]
    column_sortable_list = [PasswordResetCode.id, PasswordResetCode.expires_at]
    column_default_sort = [(PasswordResetCode.id, True)]
    
    form_columns = [
        PasswordResetCode.user_id,
        PasswordResetCode.code,
        PasswordResetCode.expires_at,
    ]
    
    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True


def init_admin(app):
    """
    Инициализация админ панели
    """
    global admin
    admin = Admin(
        app=app,
        engine=engine,
        title="SafeLogist Admin",
        base_url="/admin",
        authentication_backend=AdminAuth(secret_key=os.getenv("SECRET_KEY")),
    )
    
    # Регистрируем модели в админке
    admin.add_view(UserAdmin)
    admin.add_view(PasswordResetCodeAdmin)
    
    return admin

