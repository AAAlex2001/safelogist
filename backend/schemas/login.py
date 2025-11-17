"""
Схемы для системы логина
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from enum import Enum
from pydantic import EmailStr



# ============================================================================
# Login
# ============================================================================


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
