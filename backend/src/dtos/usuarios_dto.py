from datetime import datetime

from pydantic import BaseModel


class CreateUsuarioDTO(BaseModel):  # POST
    email: str
    nombre: str


class UpdateUsuarioDTO(BaseModel):  # PUT/PATCH
    email: str | None = None
    nombre: str | None = None
    xp_total: int | None = None
    racha_dias: int | None = None
    fecha_ultima_actividad: datetime | None = None


class DeleteUsuarioDTO(BaseModel):  # DELETE
    id: int


class GetUsuarioDTO(BaseModel):  # GET (individual)
    id: int


class UsuarioResponseDTO(BaseModel):
    id: int
    email: str
    nombre: str
    xp_total: int
    racha_dias: int
    fecha_ultima_actividad: datetime | None = None

    model_config = {"from_attributes": True}