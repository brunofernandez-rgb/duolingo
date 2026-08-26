from pydantic import BaseModel, Field


class CreateInsigniaSchema(BaseModel):
    nombre: str = Field(max_length=100)
    descripcion: str | None = None
    criterio: str


class UpdateInsigniaSchema(BaseModel):
    nombre: str | None = Field(default=None, max_length=100)
    descripcion: str | None = None
    criterio: str | None = None


class DeleteInsigniaSchema(BaseModel):
    id: int


class GetInsigniaSchema(BaseModel):
    id: int