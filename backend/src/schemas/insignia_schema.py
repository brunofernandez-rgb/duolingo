from pydantic import BaseModel, Field, field_validator

from src.utils.criterio_insignia import parsear_criterio


def validar_criterio(criterio: str | None) -> str | None:
    if criterio is None:
        return None
    if parsear_criterio(criterio) is None:
        raise ValueError(
            "El criterio debe tener el formato 'xp >= N', 'racha >= N' o "
            "'lecciones_completadas >= N'"
        )
    return criterio.strip().lower()


class CreateInsigniaSchema(BaseModel):
    nombre: str = Field(max_length=100)
    descripcion: str | None = None
    criterio: str

    _validar_criterio = field_validator("criterio")(validar_criterio)


class UpdateInsigniaSchema(BaseModel):
    nombre: str | None = Field(default=None, max_length=100)
    descripcion: str | None = None
    criterio: str | None = None

    _validar_criterio = field_validator("criterio")(validar_criterio)


class DeleteInsigniaSchema(BaseModel):
    id: int


class GetInsigniaSchema(BaseModel):
    id: int
