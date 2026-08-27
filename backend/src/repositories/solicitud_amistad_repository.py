from sqlalchemy.orm import Session

from src.db.models.solicitud_amistad_model import SolicitudAmistad
from src.db.models.usuario_model import Usuario


class SolicitudAmistadRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, solicitante_id: int, destinatario_id: int) -> SolicitudAmistad:
        solicitud = SolicitudAmistad(
            solicitante_id=solicitante_id,
            destinatario_id=destinatario_id,
            estado="pendiente",
        )
        self.db.add(solicitud)
        self.db.commit()
        self.db.refresh(solicitud)
        return solicitud

    def get_user_by_email(self, email: str) -> Usuario | None:
        return self.db.query(Usuario).filter(Usuario.email == email).first()

    def get_pending_between(self, solicitante_id: int, destinatario_id: int) -> SolicitudAmistad | None:
        return (
            self.db.query(SolicitudAmistad)
            .filter(
                SolicitudAmistad.solicitante_id == solicitante_id,
                SolicitudAmistad.destinatario_id == destinatario_id,
                SolicitudAmistad.estado == "pendiente",
            )
            .first()
        )

    def get_received(self, destinatario_id: int):
        return (
            self.db.query(SolicitudAmistad, Usuario)
            .join(Usuario, Usuario.id == SolicitudAmistad.solicitante_id)
            .filter(
                SolicitudAmistad.destinatario_id == destinatario_id,
                SolicitudAmistad.estado == "pendiente",
            )
            .order_by(SolicitudAmistad.fecha.desc())
            .all()
        )

    def get_by_id(self, solicitud_id: int) -> SolicitudAmistad | None:
        return self.db.query(SolicitudAmistad).filter(SolicitudAmistad.id == solicitud_id).first()

    def update(self, solicitud: SolicitudAmistad) -> SolicitudAmistad:
        self.db.add(solicitud)
        self.db.commit()
        self.db.refresh(solicitud)
        return solicitud
