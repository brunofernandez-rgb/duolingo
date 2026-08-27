from datetime import datetime

from pydantic import BaseModel


class CrearSolicitudAmistadDTO(BaseModel):
    solicitante_id: int
    destinatario_id: int


class SolicitudAmistadResponseDTO(BaseModel):
    id: int
    solicitante_id: int
    destinatario_id: int
    estado: str
    fecha: datetime
    solicitante_nombre: str
    solicitante_email: str

    model_config = {"from_attributes": True}
