from src.db.models.leccion_model import Leccion

from ..dtos.leccion_dto import LeccionResponseDTO


def to_leccion_response(leccion: Leccion) -> LeccionResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta."""

    return LeccionResponseDTO.model_validate(leccion)