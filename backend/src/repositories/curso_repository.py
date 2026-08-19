from sqlalchemy.orm import Session

from src.db.models.curso_model import Curso


class CursoRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, id: int, idioma_id: int, nivel: str) -> Curso:
        curso = Curso(
            id=id,
            idioma_id=idioma_id,
            nivel=nivel
        )
        self.db.add(curso)
        self.db.commit()
        self.db.refresh(curso)
        return curso

    def get_by_id(self, curso_id: int) -> Curso | None:
        return self.db.query(Curso).filter(Curso.id == curso_id).first()

    def update(self, curso: Curso) -> Curso:
        self.db.add(curso)
        self.db.commit()
        self.db.refresh(curso)
        return curso

    def delete(self, curso: Curso) -> None:
        self.db.delete(curso)
        self.db.commit()