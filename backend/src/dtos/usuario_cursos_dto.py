from datetime import datetime
from pydantic import BaseModel


class CreateUsuarioCursosDTO(BaseModel):  # POST
    usuario_id: int
    curso_id: int


class UpdateUsuarioCursosDTO(BaseModel):  # PUT/PATCH
    fecha_inscripcion: datetime | None = None


class DeleteUsuarioCursosDTO(BaseModel):  # DELETE
    usuario_id: int
    curso_id: int


class GetUsuarioCursosDTO(BaseModel):  # GET (individual)
    usuario_id: int
    curso_id: int


class UsuarioCursosResponseDTO(BaseModel):
    usuario_id: int
    curso_id: int
    fecha_inscripcion: datetime
    curso_nivel: str
    idioma_id: int
    idioma_nombre: str
    idioma_codigo: str

    model_config = {"from_attributes": True}
