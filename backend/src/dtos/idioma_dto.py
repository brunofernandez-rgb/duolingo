from pydantic import BaseModel


class CreateIdiomaDTO(BaseModel):  # POST
    nombre: str
    codigo: str


class UpdateIdiomaDTO(BaseModel):  # PUT/PATCH
    nombre: str | None = None
    codigo: str | None = None


class DeleteIdiomaDTO(BaseModel):  # DELETE
    id: int


class GetIdiomaDTO(BaseModel):  # GET (individual)
    id: int


class IdiomaResponseDTO(BaseModel):
    id: int
    nombre: str
    codigo: str

    model_config = {"from_attributes": True}