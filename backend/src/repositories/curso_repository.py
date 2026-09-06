from sqlalchemy.orm import Session
from src.db.models.idioma_model import Idioma

from src.db.models.curso_model import Curso


class CursoRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, idioma_id: int, nivel: str) -> Curso:
        curso = Curso(
            idioma_id=idioma_id,
            nivel=nivel
        )
        self.db.add(curso)
        self.db.commit()
        self.db.refresh(curso)
        return curso

    def get_by_id(self, curso_id: int) -> Curso | None:
        return self.db.query(Curso).filter(Curso.id == curso_id).first()

    def idioma_exists(self, idioma_id: int) -> bool:
        return self.db.query(Idioma).filter(Idioma.id == idioma_id).first() is not None

    def get_by_id_with_idioma(self, curso_id: int):
        return (
            self.db.query(Curso, Idioma)
            .join(Idioma, Curso.idioma_id == Idioma.id)
            .filter(Curso.id == curso_id)
            .first()
        )

    def list_all(self) -> list[Curso]:
        return self.db.query(Curso).order_by(Curso.id).all()

    def update(self, curso: Curso) -> Curso:
        self.db.add(curso)
        self.db.commit()
        self.db.refresh(curso)
        return curso

    def delete(self, curso: Curso) -> None:
        self.db.delete(curso)
        self.db.commit()