from src.db.models.curso_model import Curso

from ..dtos.curso_dto import CursoResponseDTO


def to_curso_response(curso: Curso) -> CursoResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta."""

    return CursoResponseDTO.model_validate(curso)