from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class RoleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: Optional[str] = None


class UserBase(BaseModel):
    email: str = Field(
        ...,
        pattern=r"^[\w\.-]+@[\w\.-]+\.\w+$",
        description="Địa chỉ email hợp lệ",
    )
    username: str = Field(..., min_length=3, max_length=50)
    full_name: Optional[str] = None


class RegisterRequest(UserBase):
    password: str = Field(..., min_length=6, max_length=100)


class LoginRequest(BaseModel):
    username_or_email: str = Field(..., description="Tên đăng nhập hoặc địa chỉ email")
    password: str = Field(..., description="Mật khẩu tài khoản")


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_minutes: int
    user: "UserOut"


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool
    is_superuser: bool
    roles: List[RoleOut] = []
    created_at: datetime
