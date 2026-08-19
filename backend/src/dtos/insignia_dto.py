from pydantic import BaseModel


class CreateInsigniaDTO(BaseModel):  # POST
    nombre: str
    descripcion: str | None = None
    criterio: str


class UpdateInsigniaDTO(BaseModel):  # PUT/PATCH
    nombre: str | None = None
    descripcion: str | None = None
    criterio: str | None = None


class DeleteInsigniaDTO(BaseModel):  # DELETE
    id: int


class GetInsigniaDTO(BaseModel):  # GET (individual)
    id: int


class InsigniaResponseDTO(BaseModel):
    id: int
    nombre: str
    descripcion: str | None = None
    criterio: str

    model_config = {"from_attributes": True}