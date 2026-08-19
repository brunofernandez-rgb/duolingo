from src.db.models.usuario_insignias_model import UsuarioInsignias
from ..dtos.usuario_insignias_dto import UsuarioInsigniasResponseDTO


def to_usuario_insignias_response(usuario_insignias: UsuarioInsignias) -> UsuarioInsigniasResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta."""
    return UsuarioInsigniasResponseDTO.model_validate(usuario_insignias)