from sqlalchemy.orm import Session

from src.dtos.usuarios_dto import CreateUsuarioDTO, UsuarioResponseDTO
from src.mappers.usuarios_mapper import to_usuario_response
from src.repositories.usuario_repository import UsuariosRepository
from src.utils.hash import hash_password


class UsuarioService:
    def __init__(self, db: Session):
        self.repo = UsuariosRepository(db)

    def create(self, dto: CreateUsuarioDTO, password: str) -> UsuarioResponseDTO | None:
        if self.repo.get_by_email(dto.email):
            return None
        return to_usuario_response(self.repo.create(dto.email, dto.nombre, hash_password(password)))

    def get_by_id(self, usuario_id: int) -> UsuarioResponseDTO | None:
        res = self.repo.get_by_id(usuario_id)
        return to_usuario_response(res) if res else None

    def get_ranking_global(self, periodo: str = "global") -> list[UsuarioResponseDTO]:
        if periodo == "semanal":
            return [
                to_usuario_response(usuario).model_copy(update={"xp_total": xp})
                for usuario, xp in self.repo.get_ranking_semanal()
            ]
        return [to_usuario_response(u) for u in self.repo.get_ranking(periodo)]

    def delete(self, usuario_id: int) -> bool:
        res = self.repo.get_by_id(usuario_id)
        if not res:
            return False
        self.repo.delete(res)
        return True
