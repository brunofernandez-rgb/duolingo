from datetime import datetime
from pydantic import BaseModel, Field, model_validator


class CreateAmigosSchema(BaseModel):
    usuario_a: int = Field(gt=0)
    usuario_b: int = Field(gt=0)
    fecha: datetime | None = Field(default=None)

    @model_validator(mode="after")
    def verificar_usuarios_diferentes(self):
        if self.usuario_a == self.usuario_b:
            raise ValueError("Un usuario no puede ser amigo de sí mismo (usuario_a y usuario_b deben ser diferentes)")
        return self


class UpdateAmigosSchema(BaseModel):
    fecha: datetime | None = Field(default=None)


class DeleteAmigosSchema(BaseModel):
    usuario_a: int = Field(gt=0)
    usuario_b: int = Field(gt=0)


class GetAmigosSchema(BaseModel):
    usuario_a: int = Field(gt=0)
    usuario_b: int = Field(gt=0)