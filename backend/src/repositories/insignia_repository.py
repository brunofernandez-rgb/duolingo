from sqlalchemy.orm import Session
from src.db.models.insignia_model import Insignia


class InsigniaRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, nombre: str, criterio: str, descripcion: str | None = None) -> Insignia:
        insignia = Insignia(nombre=nombre, descripcion=descripcion, criterio=criterio)
        self.db.add(insignia)
        self.db.commit()
        self.db.refresh(insignia)
        return insignia

    def get_by_id(self, insignia_id: int) -> Insignia | None:
        return self.db.query(Insignia).filter(Insignia.id == insignia_id).first()

    def update(self, insignia: Insignia) -> Insignia:
        self.db.add(insignia)
        self.db.commit()
        self.db.refresh(insignia)
        return insignia

    def delete(self, insignia: Insignia) -> None:
        self.db.delete(insignia)
        self.db.commit()