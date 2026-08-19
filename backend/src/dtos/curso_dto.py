from pydantic import BaseModel


class CreateCursoDTO(BaseModel):  # POST
    idioma_id: int
    nivel: str


class UpdateCursoDTO(BaseModel):  # PUT/PATCH
    idioma_id: int | None = None
    nivel: str | None = None


class DeleteCursoDTO(BaseModel):  # DELETE
    id: int


class GetCursoDTO(BaseModel):  # GET (individual)
    id: int


class CursoResponseDTO(BaseModel):
    id: int
    idioma_id: int
    nivel: str

    model_config = {"from_attributes": True}