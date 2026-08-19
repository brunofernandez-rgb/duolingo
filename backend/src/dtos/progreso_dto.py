from datetime import datetime
from pydantic import BaseModel


class CreateProgresoDTO(BaseModel):  # POST
    usuario_id: int
    leccion_id: int
    puntaje: int = 0
    completada: bool = False


class UpdateProgresoDTO(BaseModel):  # PUT/PATCH
    puntaje: int | None = None
    completada: bool | None = None


class DeleteProgresoDTO(BaseModel):  # DELETE
    id: int


class GetProgresoDTO(BaseModel):  # GET (individual)
    id: int


class ProgresoResponseDTO(BaseModel):
    id: int
    usuario_id: int
    leccion_id: int
    puntaje: int
    completada: bool
    fecha: datetime

    model_config = {"from_attributes": True}