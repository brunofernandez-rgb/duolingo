from pydantic import BaseModel, Field


class CreateUsuarioCursosSchema(BaseModel):

    usuario_id: int = Field(gt=0)
    curso_id: int = Field(gt=0)


class UpdateUsuarioCursosSchema(BaseModel):

    usuario_id: int | None = Field(default=None, gt=0)
    curso_id: int | None = Field(default=None, gt=0)


class DeleteUsuarioCursosSchema(BaseModel):

    usuario_id: int
    curso_id: int


class GetUsuarioCursosSchema(BaseModel):

    usuario_id: int
    curso_id: int