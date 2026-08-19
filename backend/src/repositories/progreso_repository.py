from datetime import datetime

from sqlalchemy.orm import Session

from src.db.models.progreso_model import Progreso


class ProgresoRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        id: int,
        usuario_id: int,
        leccion_id: int,
        puntaje: int,
        completada: bool,
        fecha: datetime
    ) -> Progreso:
        progreso = Progreso(
            id=id,
            usuario_id=usuario_id,
            leccion_id=leccion_id,
            puntaje=puntaje,
            completada=completada,
            fecha=fecha
        )
        self.db.add(progreso)
        self.db.commit()
        self.db.refresh(progreso)
        return progreso

    def get_by_id(self, progreso_id: int) -> Progreso | None:
        return self.db.query(Progreso).filter(Progreso.id == progreso_id).first()

    def update(self, progreso: Progreso) -> Progreso:
        self.db.add(progreso)
        self.db.commit()
        self.db.refresh(progreso)
        return progreso

    def delete(self, progreso: Progreso) -> None:
        self.db.delete(progreso)
        self.db.commit()