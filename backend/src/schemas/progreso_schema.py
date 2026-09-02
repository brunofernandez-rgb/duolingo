from pydantic import BaseModel, Field
from datetime import datetime


class CreateProgresoSchema(BaseModel):

    usuario_id: int = Field(gt=0)
    leccion_id: int = Field(gt=0)
    puntaje: int = Field(default=0, ge=0, le=100)
    completada: bool = Field(default=False)


class UpdateProgresoSchema(BaseModel):

    usuario_id: int | None = Field(default=None, gt=0)
    leccion_id: int | None = Field(default=None, gt=0)
    puntaje: int | None = Field(default=None, ge=0)
    completada: bool | None = Field(default=None)


class DeleteProgresoSchema(BaseModel):

    id: int


class GetProgresoSchema(BaseModel):

    id: int