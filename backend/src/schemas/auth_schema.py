from pydantic import BaseModel, EmailStr, Field


class LoginSchema(BaseModel):
    email: EmailStr
    password: str


class ResetPasswordSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
