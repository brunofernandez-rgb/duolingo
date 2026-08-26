from src.db.models.curso_model import Curso
from src.db.models.leccion_model import Leccion
from src.db.models.progreso_model import Progreso

from ..dtos.progreso_dto import ProgresoResponseDTO


def to_progreso_response(
    progreso: Progreso,
    leccion: Leccion,
    curso: Curso,
) -> ProgresoResponseDTO:
    """Convierte el resultado del JOIN Progreso-Leccion-Curso en un DTO."""
    return ProgresoResponseDTO(
        id=progreso.id,
        usuario_id=progreso.usuario_id,
        leccion_id=progreso.leccion_id,
        puntaje=progreso.puntaje,
        completada=progreso.completada,
        fecha=progreso.fecha,
        leccion_titulo=leccion.titulo,
        curso_id=curso.id,
        curso_nivel=curso.nivel,
    )
