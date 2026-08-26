from datetime import datetime
from sqlalchemy.orm import Session
from src.db.models.usuario_model import Usuario

class UsuariosRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, email: str, nombre: str, password_hash: str, fecha_ultima_actividad: datetime | None = None, xp_total: int = 0, racha_dias: int = 0) -> Usuario:
        usuario = Usuario(email=email, nombre=nombre, password_hash=password_hash, xp_total=xp_total, racha_dias=racha_dias, fecha_ultima_actividad=fecha_ultima_actividad)
        self.db.add(usuario)
        self.db.commit()
        self.db.refresh(usuario)
        return usuario
    
    def get_by_id(self, usuario_id: int) -> Usuario | None:
        return self.db.query(Usuario).filter(Usuario.id == usuario_id).first()

    def get_by_email(self, email: str) -> Usuario | None:
        return self.db.query(Usuario).filter(Usuario.email == email).first()

    def update(self, usuario: Usuario) -> Usuario:
        self.db.add(usuario)
        self.db.commit()
        self.db.refresh(usuario)
        return usuario
    
    def delete(self, usuario: Usuario) -> None:
        self.db.delete(usuario)
        self.db.commit()