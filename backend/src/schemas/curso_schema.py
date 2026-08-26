from pydantic import BaseModel, Field


class CreateCursoSchema(BaseModel):
    idioma_id: int
    nivel: str = Field(max_length=50)


class UpdateCursoSchema(BaseModel):
    idioma_id: int | None = None
    nivel: str | None = Field(default=None, max_length=50)


class DeleteCursoSchema(BaseModel):
    id: int


class GetCursoSchema(BaseModel):
    id: int