from src.db.models.progreso_model import Progreso

from ..dtos.progreso_dto import ProgresoResponseDTO


def to_progreso_response(progreso: Progreso) -> ProgresoResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta."""

    return ProgresoResponseDTO.model_validate(progreso)