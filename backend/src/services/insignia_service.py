from sqlalchemy.orm import Session

from src.dtos.insignia_dto import CreateInsigniaDTO, InsigniaResponseDTO
from src.mappers.insignia_mapper import to_insignia_response
from src.repositories.insignia_repository import InsigniaRepository


class InsigniaService:
    def __init__(self, db: Session):
        self.repo = InsigniaRepository(db)

    def create(self, dto: CreateInsigniaDTO) -> InsigniaResponseDTO | None:
        return to_insignia_response(
            self.repo.create(
                nombre=dto.nombre,
                descripcion=dto.descripcion,
                criterio=dto.criterio,
            )
        )

    def get_by_id(self, insignia_id: int) -> InsigniaResponseDTO | None:
        res = self.repo.get_by_id(insignia_id)
        return to_insignia_response(res) if res else None

    def delete(self, insignia_id: int) -> bool:
        res = self.repo.get_by_id(insignia_id)
        if not res:
            return False
        self.repo.delete(res)
        return True
