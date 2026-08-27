from pydantic import BaseModel, EmailStr, Field


class CrearSolicitudPorEmailSchema(BaseModel):
    solicitante_id: int = Field(gt=0)
    email: EmailStr


class ResponderSolicitudSchema(BaseModel):
    usuario_id: int = Field(gt=0)
    aceptar: bool
