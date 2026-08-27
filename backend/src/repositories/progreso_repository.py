from datetime import datetime

from sqlalchemy.orm import Session

from src.db.models.curso_model import Curso
from src.db.models.leccion_model import Leccion
from src.db.models.progreso_model import Progreso


class ProgresoRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        usuario_id: int,
        leccion_id: int,
        puntaje: int,
        completada: bool,
        fecha: datetime | None = None,
    ) -> Progreso:
        progreso = Progreso(
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

    def get_by_usuario_y_leccion(self, usuario_id: int, leccion_id: int) -> Progreso | None:
        return (
            self.db.query(Progreso)
            .filter(Progreso.usuario_id == usuario_id, Progreso.leccion_id == leccion_id)
            .order_by(Progreso.completada.desc(), Progreso.id.desc())
            .first()
        )

    def get_progreso_curso_join(self, usuario_id: int, curso_id: int) -> tuple[int, int, int | None]:
        lecciones = (
            self.db.query(Leccion)
            .filter(Leccion.curso_id == curso_id)
            .order_by(Leccion.orden)
            .all()
        )
        completadas = {
            progreso.leccion_id
            for progreso in self.db.query(Progreso)
            .filter(Progreso.usuario_id == usuario_id, Progreso.completada.is_(True))
            .all()
        }
        lecciones_completadas = sum(leccion.id in completadas for leccion in lecciones)
        proxima = next((leccion.id for leccion in lecciones if leccion.id not in completadas), None)
        return len(lecciones), lecciones_completadas, proxima

    def get_by_id_with_leccion_curso(self, progreso_id: int):
        return (
            self.db.query(Progreso, Leccion, Curso)
            .join(Leccion, Progreso.leccion_id == Leccion.id)
            .join(Curso, Leccion.curso_id == Curso.id)
            .filter(Progreso.id == progreso_id)
            .first()
        )

    def get_completada(self, usuario_id: int, leccion_id: int) -> bool:
        return (
            self.db.query(Progreso)
            .filter(
                Progreso.usuario_id == usuario_id,
                Progreso.leccion_id == leccion_id,
                Progreso.completada.is_(True),
            )
            .first()
            is not None
        )

    def update(self, progreso: Progreso) -> Progreso:
        self.db.add(progreso)
        self.db.commit()
        self.db.refresh(progreso)
        return progreso

    def delete(self, progreso: Progreso) -> None:
        self.db.delete(progreso)
        self.db.commit()