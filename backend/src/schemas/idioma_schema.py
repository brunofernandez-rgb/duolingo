from pydantic import BaseModel, Field


class CreateIdiomaSchema(BaseModel):
    nombre: str = Field(max_length=50)
    codigo: str = Field(max_length=10)
    bandera_url: str | None = Field(default=None, max_length=255)


class UpdateIdiomaSchema(BaseModel):
    nombre: str | None = Field(default=None, max_length=50)
    codigo: str | None = Field(default=None, max_length=10)


class DeleteIdiomaSchema(BaseModel):
    id: int


class GetIdiomaSchema(BaseModel):
    id: int
