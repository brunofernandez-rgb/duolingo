from sqlalchemy.orm import Session

from src.dtos.usuario_insignias_dto import CreateUsuarioInsigniasDTO, UsuarioInsigniasResponseDTO
from src.mappers.usuario_insignias_mapper import to_usuario_insignias_response
from src.repositories.usuario_insignias_repository import UsuarioInsigniasRepository
from src.repositories.usuario_repository import UsuariosRepository
from src.services.evaluador_insignias_service import EvaluadorInsigniasService


class UsuarioInsigniasService:
    def __init__(self, db: Session):
        self.repo = UsuarioInsigniasRepository(db)
        self.usuario_repo = UsuariosRepository(db)
        self.evaluador = EvaluadorInsigniasService(db)

    def create(self, dto: CreateUsuarioInsigniasDTO) -> UsuarioInsigniasResponseDTO | None:
        if self.repo.get_by_id(dto.usuario_id, dto.insignia_id):
            return None
        self.repo.create(dto.usuario_id, dto.insignia_id)
        res = self.repo.get_by_id_with_insignia(dto.usuario_id, dto.insignia_id)
        return to_usuario_insignias_response(res[0], res[1])

    def get_insignias_usuario(self, usuario_id: int) -> list[UsuarioInsigniasResponseDTO]:
        usuario = self.usuario_repo.get_by_id(usuario_id)
        if usuario:
            # Reevalúa siempre el estado actual. Esto también recupera insignias
            # de usuarios que ya cumplían el criterio antes de esta funcionalidad.
            self.evaluador.otorgar_cumplidas(usuario)
        registros = self.repo.get_by_usuario_id_with_join(usuario_id)
        return [to_usuario_insignias_response(ui, ins) for ui, ins in registros]
