from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    name: str
    is_active: bool = True


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    user_id: int
    email: Optional[EmailStr] = None
    name: Optional[str] = None


class UserUpdateResponse(BaseModel):
    email: EmailStr
    name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(UserBase):
    id: int

    class Config:
        from_attributes = True


class PasswordUpdate(BaseModel):
    user_id: int
    current_password: str
    new_password: str


class PasswordUpdateResponse(BaseModel):
    message: str
    status: str

    class Config:
        extra = "forbid"


class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: str
    refresh_expires_in: int

    class Config:
        extra = "forbid"


class TokenRefresh(BaseModel):
    """リフレッシュトークンのレスポンス用スキーマ"""

    access_token: str
    token_type: str
    expires_in: int

    class Config:
        extra = "forbid"
