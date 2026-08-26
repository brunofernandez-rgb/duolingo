from src.db.models.amigos_model import Amigos
from src.db.models.usuario_model import Usuario
from ..dtos.amigos_dto import AmigosResponseDTO


def to_amigos_response(amigos: Amigos, usuario_amigo: Usuario) -> AmigosResponseDTO:
    """Convierte el resultado del JOIN Amigos-Usuario en un DTO."""
    return AmigosResponseDTO(
        usuario_a=amigos.usuario_a,
        usuario_b=amigos.usuario_b,
        fecha=amigos.fecha,
        amigo_id=usuario_amigo.id,
        amigo_email=usuario_amigo.email,
        amigo_nombre=usuario_amigo.nombre,
        amigo_xp_total=usuario_amigo.xp_total,
        amigo_racha_dias=usuario_amigo.racha_dias,
        amigo_fecha_ultima_actividad=usuario_amigo.fecha_ultima_actividad,
    )
