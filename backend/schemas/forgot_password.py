from pydantic import BaseModel, EmailStr


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetVerify(BaseModel):
    code: str


class PasswordResetReset(BaseModel):
    user_id: int
    new_password: str
