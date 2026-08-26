from sqlalchemy.orm import Session

from src.dtos.usuarios_dto import CreateUsuarioDTO, UsuarioResponseDTO
from src.mappers.usuarios_mapper import to_usuario_response
from src.repositories.usuario_repository import UsuariosRepository


class UsuarioService:
    def __init__(self, db: Session):
        self.repo = UsuariosRepository(db)

    def create(self, dto: CreateUsuarioDTO) -> UsuarioResponseDTO | None:
        if self.repo.get_by_email(dto.email):
            return None
        return to_usuario_response(self.repo.create(dto.email, dto.nombre))

    def get_by_id(self, usuario_id: int) -> UsuarioResponseDTO | None:
        res = self.repo.get_by_id(usuario_id)
        return to_usuario_response(res) if res else None

    def get_ranking_global(self, periodo: str = "global") -> list[UsuarioResponseDTO]:
        return [to_usuario_response(u) for u in self.repo.get_ranking(periodo, limit=50)]

    def delete(self, usuario_id: int) -> bool:
        res = self.repo.get_by_id(usuario_id)
        if not res:
            return False
        self.repo.delete(res)
        return True
