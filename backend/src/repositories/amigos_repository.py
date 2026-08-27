from sqlalchemy import case, or_
from sqlalchemy.orm import Session
from src.db.models.amigos_model import Amigos
from src.db.models.usuario_model import Usuario


class AmigosRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, usuario_a: int, usuario_b: int) -> Amigos:
        amigo = Amigos(usuario_a=usuario_a, usuario_b=usuario_b)
        self.db.add(amigo)
        self.db.commit()
        self.db.refresh(amigo)
        return amigo

    def get_by_id(self, usuario_a: int, usuario_b: int) -> Amigos | None:
        return (
            self.db.query(Amigos)
            .filter(
                Amigos.usuario_a == usuario_a,
                Amigos.usuario_b == usuario_b,
            )
            .first()
        )

    def get_by_id_with_usuario(self, usuario_a: int, usuario_b: int):
        amigo_id = case(
            (Amigos.usuario_a == usuario_a, Amigos.usuario_b),
            else_=Amigos.usuario_a,
        )
        return (
            self.db.query(Amigos, Usuario)
            .join(Usuario, Usuario.id == amigo_id)
            .filter(
                or_(
                    (Amigos.usuario_a == usuario_a) & (Amigos.usuario_b == usuario_b),
                    (Amigos.usuario_a == usuario_b) & (Amigos.usuario_b == usuario_a),
                )
            )
            .first()
        )

    def get_amigos_join_usuario(self, usuario_id: int):
        amigo_id = case(
            (Amigos.usuario_a == usuario_id, Amigos.usuario_b),
            else_=Amigos.usuario_a,
        )
        return (
            self.db.query(Amigos, Usuario)
            .join(Usuario, Usuario.id == amigo_id)
            .filter(or_(Amigos.usuario_a == usuario_id, Amigos.usuario_b == usuario_id))
            .order_by(Usuario.nombre.asc(), Usuario.id.asc())
            .all()
        )

    def get_ranking_amigos_join(self, usuario_id: int):
        amigo_id = case(
            (Amigos.usuario_a == usuario_id, Amigos.usuario_b),
            else_=Amigos.usuario_a,
        )
        return (
            self.db.query(Amigos, Usuario)
            .join(Usuario, Usuario.id == amigo_id)
            .filter(or_(Amigos.usuario_a == usuario_id, Amigos.usuario_b == usuario_id))
            .order_by(Usuario.xp_total.desc(), Usuario.id.asc())
            .all()
        )

    def get_amigos_de_usuario(self, usuario_id: int) -> list[Amigos]:
        """Obtiene la lista de amistades donde el usuario participa (sea usuario_a o usuario_b)."""
        return (
            self.db.query(Amigos)
            .filter(or_(Amigos.usuario_a == usuario_id, Amigos.usuario_b == usuario_id))
            .all()
        )

    def update(self, amigo: Amigos) -> Amigos:
        self.db.add(amigo)
        self.db.commit()
        self.db.refresh(amigo)
        return amigo

    def delete(self, amigo: Amigos) -> None:
        self.db.delete(amigo)
        self.db.commit()