from src.db.models.curso_model import Curso
from src.db.models.idioma_model import Idioma
from src.db.models.leccion_model import Leccion

from ..dtos.leccion_dto import LeccionResponseDTO, LeccionVocabularioDTO


def to_leccion_response(
    leccion: Leccion,
    curso: Curso,
    idioma: Idioma,
) -> LeccionResponseDTO:
    """Convierte el resultado del JOIN Leccion-Curso-Idioma en un DTO."""
    return LeccionResponseDTO(
        id=leccion.id,
        curso_id=leccion.curso_id,
        orden=leccion.orden,
        titulo=leccion.titulo,
        xp_recompensa=leccion.xp_recompensa,
        curso_nivel=curso.nivel,
        idioma_id=idioma.id,
        idioma_nombre=idioma.nombre,
        idioma_codigo=idioma.codigo,
        vocabulario=[
            LeccionVocabularioDTO(
                emoji=palabra.emoji,
                fuente=palabra.fuente,
                traduccion=getattr(palabra, f"traduccion_{idioma.codigo}", palabra.traduccion_en),
                # "fuente" is Spanish in the database. Expose its equivalents
                # so the client can ask the question in its selected UI language.
                significados={
                    "es": palabra.fuente,
                    "en": palabra.traduccion_en,
                    "pt": palabra.traduccion_pt,
                },
            )
            for palabra in leccion.vocabulario
        ],
    )
