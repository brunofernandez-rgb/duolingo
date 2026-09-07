from pydantic import BaseModel, Field


class CreateLeccionVocabularioSchema(BaseModel):
    fuente: str = Field(min_length=1, max_length=255)
    traduccion: str = Field(min_length=1, max_length=255)


class CreateLeccionSchema(BaseModel):
    curso_id: int
    orden: int = Field(ge=1)
    titulo: str = Field(max_length=150)
    xp_recompensa: int = Field(default=0, ge=5, le=50)
    vocabulario: list[CreateLeccionVocabularioSchema] = Field(min_length=1, max_length=50)


class UpdateLeccionSchema(BaseModel):
    curso_id: int | None = None
    orden: int | None = Field(default=None, ge=0)
    titulo: str | None = Field(default=None, max_length=150)
    xp_recompensa: int | None = Field(default=None, ge=0)


class DeleteLeccionSchema(BaseModel):
    id: int


class GetLeccionSchema(BaseModel):
    id: int
