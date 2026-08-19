from src.db.models.usuario_model import Usuario
from ..dtos.usuarios_dto import UsuarioResponseDTO

def to_usuario_response(usuario: Usuario) -> UsuarioResponseDTO:

    return UsuarioResponseDTO.model_validate(usuario)