from sqlalchemy.orm import Session

from src.dtos.idioma_dto import CreateIdiomaDTO, IdiomaResponseDTO
from src.mappers.idiomas_mapper import to_idioma_response
from src.repositories.idioma_repository import IdiomaRepository


class IdiomaService:
    def __init__(self, db: Session):
        self.repo = IdiomaRepository(db)

    def create(self, dto: CreateIdiomaDTO) -> IdiomaResponseDTO | None:
        if self.repo.get_by_codigo(dto.codigo):
            return None
        return to_idioma_response(self.repo.create(dto.nombre, dto.codigo))

    def get_by_id(self, idioma_id: int) -> IdiomaResponseDTO | None:
        res = self.repo.get_by_id(idioma_id)
        return to_idioma_response(res) if res else None

    def list_all(self) -> list[IdiomaResponseDTO]:
        return [to_idioma_response(idioma) for idioma in self.repo.list_all()]

    def delete(self, idioma_id: int) -> bool:
        res = self.repo.get_by_id(idioma_id)
        if not res:
            return False
        self.repo.delete(res)
        return True