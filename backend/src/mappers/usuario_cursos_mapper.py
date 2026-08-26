from src.db.models.curso_model import Curso
from src.db.models.idioma_model import Idioma
from src.db.models.usuario_cursos_model import UsuarioCurso
from ..dtos.usuario_cursos_dto import UsuarioCursosResponseDTO


def to_usuario_cursos_response(
    usuario_curso: UsuarioCurso,
    curso: Curso,
    idioma: Idioma,
) -> UsuarioCursosResponseDTO:
    """Convierte el resultado del JOIN UsuarioCurso-Curso-Idioma en un DTO."""
    return UsuarioCursosResponseDTO(
        usuario_id=usuario_curso.usuario_id,
        curso_id=usuario_curso.curso_id,
        fecha_inscripcion=usuario_curso.fecha_inscripcion,
        curso_nivel=curso.nivel,
        idioma_id=idioma.id,
        idioma_nombre=idioma.nombre,
        idioma_codigo=idioma.codigo,
    )
