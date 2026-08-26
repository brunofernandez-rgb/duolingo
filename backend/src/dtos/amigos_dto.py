from datetime import datetime
from pydantic import BaseModel


class CreateAmigosDTO(BaseModel):  # POST
    usuario_a: int
    usuario_b: int


class UpdateAmigosDTO(BaseModel):  # PUT/PATCH
    fecha: datetime | None = None


class DeleteAmigosDTO(BaseModel):  # DELETE
    usuario_a: int
    usuario_b: int


class GetAmigosDTO(BaseModel):  # GET (individual)
    usuario_a: int
    usuario_b: int


class AmigosResponseDTO(BaseModel):
    usuario_a: int
    usuario_b: int
    fecha: datetime
    amigo_id: int
    amigo_email: str
    amigo_nombre: str
    amigo_xp_total: int
    amigo_racha_dias: int
    amigo_fecha_ultima_actividad: datetime | None = None

    model_config = {"from_attributes": True}
