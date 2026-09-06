from sqlalchemy.orm import Session

from src.dtos.usuario_cursos_dto import CreateUsuarioCursosDTO, UsuarioCursosResponseDTO
from src.mappers.usuario_cursos_mapper import to_usuario_cursos_response
from src.repositories.usuario_cursos_repository import UsuarioCursosRepository
from src.repositories.curso_repository import CursoRepository
from src.repositories.progreso_repository import ProgresoRepository


class UsuarioCursosService:
    def __init__(self, db: Session):
        self.repo = UsuarioCursosRepository(db)
        self.curso_repo = CursoRepository(db)
        self.progreso_repo = ProgresoRepository(db)

    def create(self, dto: CreateUsuarioCursosDTO) -> UsuarioCursosResponseDTO | None:
        if self.repo.get_by_id(dto.usuario_id, dto.curso_id):
            return None
        curso = self.curso_repo.get_by_id(dto.curso_id)
        if not curso:
            return None
        cursos_mismo_idioma = self.repo.get_all_by_usuario_id_and_idioma(dto.usuario_id, curso.idioma_id)
        if any(not self.progreso_repo.curso_completado(dto.usuario_id, inscripcion.curso_id) for inscripcion in cursos_mismo_idioma):
            return None
        self.repo.create(dto.usuario_id, dto.curso_id)
        res = self.repo.get_by_id_with_curso_idioma(dto.usuario_id, dto.curso_id)
        return to_usuario_cursos_response(res[0], res[1], res[2])

    def get_cursos_del_usuario(self, usuario_id: int) -> list[UsuarioCursosResponseDTO]:
        registros = self.repo.get_by_usuario_id_with_join(usuario_id)
        return [to_usuario_cursos_response(uc, c, i) for uc, c, i in registros]

    def delete(self, usuario_id: int, curso_id: int) -> bool:
        res = self.repo.get_by_id(usuario_id, curso_id)
        if not res:
            return False
        self.repo.delete(res)
        return True