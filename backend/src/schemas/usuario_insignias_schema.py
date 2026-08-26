from datetime import datetime
from pydantic import BaseModel, Field


class CreateUsuarioInsigniasSchema(BaseModel):
    usuario_id: int = Field(gt=0)
    insignia_id: int = Field(gt=0)
    fecha: datetime | None = Field(default=None)


class UpdateUsuarioInsigniasSchema(BaseModel):
    fecha: datetime | None = Field(default=None)


class DeleteUsuarioInsigniasSchema(BaseModel):
    usuario_id: int = Field(gt=0)
    insignia_id: int = Field(gt=0)


class GetUsuarioInsigniasSchema(BaseModel):
    usuario_id: int = Field(gt=0)
    insignia_id: int = Field(gt=0)