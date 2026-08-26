from src.db.models.insignia_model import Insignia
from src.db.models.usuario_insignias_model import UsuarioInsignia
from ..dtos.usuario_insignias_dto import UsuarioInsigniasResponseDTO


def to_usuario_insignias_response(
    usuario_insignia: UsuarioInsignia,
    insignia: Insignia,
) -> UsuarioInsigniasResponseDTO:
    """Convierte el resultado del JOIN UsuarioInsignia-Insignia en un DTO."""
    return UsuarioInsigniasResponseDTO(
        usuario_id=usuario_insignia.usuario_id,
        insignia_id=usuario_insignia.insignia_id,
        fecha=usuario_insignia.fecha,
        insignia_nombre=insignia.nombre,
        insignia_descripcion=insignia.descripcion,
        insignia_criterio=insignia.criterio,
    )
