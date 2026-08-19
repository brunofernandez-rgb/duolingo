from src.db.models.usuario_cursos_model import UsuarioCursos
from ..dtos.usuario_cursos_dto import UsuarioCursosResponseDTO


def to_usuario_cursos_response(usuario_cursos: UsuarioCursos) -> UsuarioCursosResponseDTO:
    """Convierte un Model SQLAlchemy en un DTO de respuesta."""
    return UsuarioCursosResponseDTO.model_validate(usuario_cursos)