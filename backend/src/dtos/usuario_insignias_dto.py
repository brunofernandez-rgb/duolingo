from datetime import datetime
from pydantic import BaseModel


class CreateUsuarioInsigniasDTO(BaseModel):  # POST
    usuario_id: int
    insignia_id: int


class UpdateUsuarioInsigniasDTO(BaseModel):  # PUT/PATCH
    fecha: datetime | None = None


class DeleteUsuarioInsigniasDTO(BaseModel):  # DELETE
    usuario_id: int
    insignia_id: int


class GetUsuarioInsigniasDTO(BaseModel):  # GET (individual)
    usuario_id: int
    insignia_id: int


class UsuarioInsigniasResponseDTO(BaseModel):
    usuario_id: int
    insignia_id: int
    fecha: datetime

    model_config = {"from_attributes": True}