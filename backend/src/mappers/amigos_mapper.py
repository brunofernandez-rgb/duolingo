from src.db.models.amigos_model import Amigos
from ..dtos.amigos_dto import AmigosResponseDTO


def to_amigos_response(amigos: Amigos) -> AmigosResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta."""
    return AmigosResponseDTO.model_validate(amigos)