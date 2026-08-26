from src.db.models.curso_model import Curso
from src.db.models.idioma_model import Idioma

from ..dtos.curso_dto import CursoResponseDTO


def to_curso_response(curso: Curso, idioma: Idioma) -> CursoResponseDTO:
    """Convierte el resultado del JOIN Curso-Idioma en un DTO."""
    return CursoResponseDTO(
        id=curso.id,
        idioma_id=curso.idioma_id,
        nivel=curso.nivel,
        idioma_nombre=idioma.nombre,
        idioma_codigo=idioma.codigo,
    )
