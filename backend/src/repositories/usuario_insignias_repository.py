from sqlalchemy.orm import Session

from src.db.models.insignia_model import Insignia
from src.db.models.usuario_insignias_model import UsuarioInsignia


class UsuarioInsigniasRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, usuario_id: int, insignia_id: int) -> UsuarioInsignia:
        usuario_insignia = UsuarioInsignia(usuario_id=usuario_id, insignia_id=insignia_id)
        self.db.add(usuario_insignia)
        self.db.commit()
        self.db.refresh(usuario_insignia)
        return usuario_insignia

    def get_by_id(self, usuario_id: int, insignia_id: int) -> UsuarioInsignia | None:
        return (
            self.db.query(UsuarioInsignia)
            .filter(
                UsuarioInsignia.usuario_id == usuario_id,
                UsuarioInsignia.insignia_id == insignia_id,
            )
            .first()
        )

    def get_by_usuario_id(self, usuario_id: int) -> list[UsuarioInsignia]:
        """Obtiene todas las insignias obtenidas por un usuario."""
        return self.db.query(UsuarioInsignia).filter(UsuarioInsignia.usuario_id == usuario_id).all()

    def get_by_id_with_insignia(
        self, usuario_id: int, insignia_id: int
    ) -> tuple[UsuarioInsignia, Insignia] | None:
        return (
            self.db.query(UsuarioInsignia, Insignia)
            .join(Insignia, UsuarioInsignia.insignia_id == Insignia.id)
            .filter(
                UsuarioInsignia.usuario_id == usuario_id,
                UsuarioInsignia.insignia_id == insignia_id,
            )
            .first()
        )

    def get_by_usuario_id_with_join(
        self, usuario_id: int
    ) -> list[tuple[UsuarioInsignia, Insignia]]:
        return (
            self.db.query(UsuarioInsignia, Insignia)
            .join(Insignia, UsuarioInsignia.insignia_id == Insignia.id)
            .filter(UsuarioInsignia.usuario_id == usuario_id)
            .order_by(UsuarioInsignia.fecha.desc(), Insignia.id)
            .all()
        )

    def update(self, usuario_insignia: UsuarioInsignia) -> UsuarioInsignia:
        self.db.add(usuario_insignia)
        self.db.commit()
        self.db.refresh(usuario_insignia)
        return usuario_insignia

    def delete(self, usuario_insignia: UsuarioInsignia) -> None:
        self.db.delete(usuario_insignia)
        self.db.commit()
