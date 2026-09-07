from pydantic import BaseModel, Field


class LeccionVocabularioDTO(BaseModel):
    emoji: str
    fuente: str
    traduccion: str
    significados: dict[str, str]


class CreateLeccionDTO(BaseModel):  # POST
    curso_id: int
    orden: int
    titulo: str
    xp_recompensa: int


class UpdateLeccionDTO(BaseModel):  # PUT/PATCH
    curso_id: int | None = None
    orden: int | None = None
    titulo: str | None = None
    xp_recompensa: int | None = None


class DeleteLeccionDTO(BaseModel):  # DELETE
    id: int


class GetLeccionDTO(BaseModel):  # GET (individual)
    id: int


class LeccionResponseDTO(BaseModel):
    id: int
    curso_id: int
    orden: int
    titulo: str
    xp_recompensa: int
    curso_nivel: str
    idioma_id: int
    idioma_nombre: str
    idioma_codigo: str
    vocabulario: list[LeccionVocabularioDTO] = Field(default_factory=list)

    model_config = {"from_attributes": True}
