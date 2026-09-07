from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class CreateUsuarioSchema(BaseModel):
    email: EmailStr
    nombre: str = Field(max_length=100)
    password: str = Field(min_length=8)
    xp_total: int = Field(default=0, ge=0)
    racha_dias: int = Field(default=0, ge=0)
    fecha_ultima_actividad: datetime | None = None


class UpdateUsuarioSchema(BaseModel):
    email: EmailStr | None = None
    nombre: str | None = Field(default=None, max_length=100)
    xp_total: int | None = Field(default=None, ge=0)
    racha_dias: int | None = Field(default=None, ge=0)
    fecha_ultima_actividad: datetime | None = None


class DeleteUsuarioSchema(BaseModel):
    id: int


class PasswordConfirmationSchema(BaseModel):
    password: str = Field(min_length=1)


class ChangePasswordSchema(BaseModel):
    password_actual: str = Field(min_length=1)
    password_nueva: str = Field(min_length=8)


class ChangeUsernameSchema(BaseModel):
    nombre: str = Field(min_length=1, max_length=100)


class GetUsuarioSchema(BaseModel):
    id: int
