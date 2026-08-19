from sqlalchemy.orm import Session
from src.db.models.idioma_model import Idioma

class IdiomaRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, nombre: str, codigo: str) -> Idioma:
        idioma = Idioma(nombre=nombre, codigo=codigo)
        self.db.add(idioma)
        self.db.commit()
        self.db.refresh(idioma)
        return idioma

    def get_by_id(self, idioma_id: int) -> Idioma | None:
        return self.db.query(Idioma).filter(Idioma.id == idioma_id).first()

    def update(self, idioma: Idioma) -> Idioma:
        self.db.add(idioma)
        self.db.commit()
        self.db.refresh(idioma)
        return idioma

    def delete(self, idioma: Idioma) -> None:
        self.db.delete(idioma)
        self.db.commit()