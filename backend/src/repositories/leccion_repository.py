from sqlalchemy.orm import Session

from src.db.models.leccion_model import Leccion


class LeccionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        id: int,
        curso_id: int,
        orden: int,
        titulo: str,
        xp_recompensa: int
    ) -> Leccion:
        leccion = Leccion(
            id=id,
            curso_id=curso_id,
            orden=orden,
            titulo=titulo,
            xp_recompensa=xp_recompensa
        )
        self.db.add(leccion)
        self.db.commit()
        self.db.refresh(leccion)
        return leccion

    def get_by_id(self, leccion_id: int) -> Leccion | None:
        return self.db.query(Leccion).filter(Leccion.id == leccion_id).first()

    def update(self, leccion: Leccion) -> Leccion:
        self.db.add(leccion)
        self.db.commit()
        self.db.refresh(leccion)
        return leccion

    def delete(self, leccion: Leccion) -> None:
        self.db.delete(leccion)
        self.db.commit()