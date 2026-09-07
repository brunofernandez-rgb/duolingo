from sqlalchemy.orm import Session
from src.db.models.idioma_model import Idioma

class IdiomaRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, nombre: str, codigo: str, bandera_url: str | None = None) -> Idioma:
        idioma = Idioma(nombre=nombre, codigo=codigo, bandera_url=bandera_url)
        self.db.add(idioma)
        self.db.commit()
        self.db.refresh(idioma)
        return idioma

    def get_by_id(self, idioma_id: int) -> Idioma | None:
        return self.db.query(Idioma).filter(Idioma.id == idioma_id).first()

    def get_by_codigo(self, codigo: str) -> Idioma | None:
        return self.db.query(Idioma).filter(Idioma.codigo == codigo).first()

    def list_all(self) -> list[Idioma]:
        return self.db.query(Idioma).order_by(Idioma.nombre).all()

    def update(self, idioma: Idioma) -> Idioma:
        self.db.add(idioma)
        self.db.commit()
        self.db.refresh(idioma)
        return idioma

    def delete(self, idioma: Idioma) -> None:
        self.db.delete(idioma)
        self.db.commit()
