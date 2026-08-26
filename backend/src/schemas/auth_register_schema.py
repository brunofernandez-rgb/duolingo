from pydantic import BaseModel, EmailStr, Field


class RegisterSchema(BaseModel):
    email: EmailStr
    nombre: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8)