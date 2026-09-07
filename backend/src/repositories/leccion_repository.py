from sqlalchemy.orm import Session

from src.db.models.leccion_model import Leccion
from src.db.models.curso_model import Curso
from src.db.models.idioma_model import Idioma
from src.db.models.leccion_vocabulario_model import LeccionVocabulario


class LeccionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        curso_id: int,
        orden: int,
        titulo: str,
        xp_recompensa: int,
        vocabulario: list[dict[str, str]],
    ) -> Leccion:
        leccion = Leccion(
            curso_id=curso_id,
            orden=orden,
            titulo=titulo,
            xp_recompensa=xp_recompensa
        )
        self.db.add(leccion)
        self.db.flush()
        self.db.add_all([
            LeccionVocabulario(
                leccion_id=leccion.id,
                emoji="📘",
                fuente=palabra["fuente"],
                traduccion_en=palabra["traduccion"],
                traduccion_fr=palabra["traduccion"],
                traduccion_de=palabra["traduccion"],
                traduccion_it=palabra["traduccion"],
                traduccion_pt=palabra["traduccion"],
            )
            for palabra in vocabulario
        ])
        self.db.commit()
        self.db.refresh(leccion)
        return leccion

    def get_by_id(self, leccion_id: int) -> Leccion | None:
        return self.db.query(Leccion).filter(Leccion.id == leccion_id).first()

    def get_by_curso_y_orden(self, curso_id: int, orden: int) -> Leccion | None:
        return self.db.query(Leccion).filter(Leccion.curso_id == curso_id, Leccion.orden == orden).first()

    def get_by_id_with_curso_idioma(self, leccion_id: int):
        return (
            self.db.query(Leccion, Curso, Idioma)
            .join(Curso, Leccion.curso_id == Curso.id)
            .join(Idioma, Curso.idioma_id == Idioma.id)
            .filter(Leccion.id == leccion_id)
            .first()
        )

    def get_by_curso_id_with_join(self, curso_id: int):
        return (
            self.db.query(Leccion, Curso, Idioma)
            .join(Curso, Leccion.curso_id == Curso.id)
            .join(Idioma, Curso.idioma_id == Idioma.id)
            .filter(Leccion.curso_id == curso_id)
            .order_by(Leccion.orden)
            .all()
        )

    def update(self, leccion: Leccion) -> Leccion:
        self.db.add(leccion)
        self.db.commit()
        self.db.refresh(leccion)
        return leccion

    def delete(self, leccion: Leccion) -> None:
        self.db.delete(leccion)
        self.db.commit()
