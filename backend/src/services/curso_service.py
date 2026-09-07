from sqlalchemy.orm import Session

from src.dtos.curso_dto import CreateCursoDTO, CursoResponseDTO
from src.mappers.curso_mapper import to_curso_response
from src.repositories.curso_repository import CursoRepository


class CursoService:
    def __init__(self, db: Session):
        self.repo = CursoRepository(db)

    def create(self, dto: CreateCursoDTO) -> CursoResponseDTO | None:
        if dto.nivel not in ["A1", "A2", "B1", "B2", "C1", "TECNICO"]:
            return None
        if not self.repo.idioma_exists(dto.idioma_id):
            return None
        if self.repo.get_by_idioma_y_nivel(dto.idioma_id, dto.nivel):
            return None
        curso = self.repo.create(dto.idioma_id, dto.nivel)
        curso_model, idioma_model = self.repo.get_by_id_with_idioma(curso.id)
        return to_curso_response(curso_model, idioma_model)

    def get_by_id(self, curso_id: int) -> CursoResponseDTO | None:
        res = self.repo.get_by_id_with_idioma(curso_id)
        return to_curso_response(res[0], res[1]) if res else None

    def list_all(self) -> list[CursoResponseDTO]:
        result = []
        for curso in self.repo.list_all():
            joined = self.repo.get_by_id_with_idioma(curso.id)
            if joined:
                result.append(to_curso_response(joined[0], joined[1]))
        return result

    def delete(self, curso_id: int) -> bool:
        res = self.repo.get_by_id(curso_id)
        if not res:
            return False
        self.repo.delete(res)
        return True
