from sqlalchemy.orm import Session

from src.dtos.leccion_dto import CreateLeccionDTO, LeccionResponseDTO
from src.mappers.leccion_mapper import to_leccion_response
from src.repositories.leccion_repository import LeccionRepository


class LeccionService:
    def __init__(self, db: Session):
        self.repo = LeccionRepository(db)

    def create(self, dto: CreateLeccionDTO) -> LeccionResponseDTO | None:
        if not (5 <= dto.xp_recompensa <= 50):
            return None
        if self.repo.get_by_curso_y_orden(dto.curso_id, dto.orden):
            return None

        leccion = self.repo.create(dto.curso_id, dto.orden, dto.titulo, dto.xp_recompensa)
        res = self.repo.get_by_id_with_curso_idioma(leccion.id)
        return to_leccion_response(res[0], res[1], res[2])

    def get_by_id(self, leccion_id: int) -> LeccionResponseDTO | None:
        res = self.repo.get_by_id_with_curso_idioma(leccion_id)
        return to_leccion_response(res[0], res[1], res[2]) if res else None

    def get_lecciones_por_curso(self, curso_id: int) -> list[LeccionResponseDTO]:
        registros = self.repo.get_by_curso_id_with_join(curso_id)
        return [to_leccion_response(l, c, i) for l, c, i in registros]

    def delete(self, leccion_id: int) -> bool:
        res = self.repo.get_by_id(leccion_id)
        if not res:
            return False
        self.repo.delete(res)
        return True