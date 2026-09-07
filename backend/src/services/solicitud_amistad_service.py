from src.dtos.solicitud_amistad_dto import SolicitudAmistadResponseDTO
from src.repositories.amigos_repository import AmigosRepository
from src.repositories.solicitud_amistad_repository import SolicitudAmistadRepository
from src.repositories.usuario_repository import UsuariosRepository

ADMIN_EMAIL = "admin@gmail.com"


class SolicitudAmistadService:
    def __init__(self, db):
        self.repo = SolicitudAmistadRepository(db)
        self.amigos_repo = AmigosRepository(db)
        self.usuarios_repo = UsuariosRepository(db)

    def create_by_email(self, solicitante_id: int, email: str) -> SolicitudAmistadResponseDTO | None:
        solicitante = self.usuarios_repo.get_by_id(solicitante_id)
        destinatario = self.repo.get_user_by_email(email)
        if (
            not solicitante
            or not destinatario
            or solicitante.id == destinatario.id
            or solicitante.email.lower() == ADMIN_EMAIL
            or destinatario.email.lower() == ADMIN_EMAIL
        ):
            return None
        if (
            self.amigos_repo.get_by_id(solicitante.id, destinatario.id)
            or self.amigos_repo.get_by_id(destinatario.id, solicitante.id)
            or self.repo.get_pending_between(solicitante.id, destinatario.id)
            or self.repo.get_pending_between(destinatario.id, solicitante.id)
        ):
            return None
        solicitud = self.repo.create(solicitante.id, destinatario.id)
        return self._to_response(solicitud, solicitante)

    def get_received(self, usuario_id: int) -> list[SolicitudAmistadResponseDTO]:
        usuario = self.usuarios_repo.get_by_id(usuario_id)
        if not usuario or usuario.email.lower() == ADMIN_EMAIL:
            return []
        return [self._to_response(solicitud, solicitante) for solicitud, solicitante in self.repo.get_received(usuario_id)]

    def respond(self, solicitud_id: int, usuario_id: int, aceptar: bool):
        solicitud = self.repo.get_by_id(solicitud_id)
        if not solicitud or solicitud.destinatario_id != usuario_id or solicitud.estado != "pendiente":
            return None
        solicitante = self.usuarios_repo.get_by_id(solicitud.solicitante_id)
        destinatario = self.usuarios_repo.get_by_id(solicitud.destinatario_id)
        if not solicitante or not destinatario or solicitante.email.lower() == ADMIN_EMAIL or destinatario.email.lower() == ADMIN_EMAIL:
            return None
        if aceptar:
            if not self.amigos_repo.get_by_id(solicitud.solicitante_id, solicitud.destinatario_id):
                self.amigos_repo.create(solicitud.solicitante_id, solicitud.destinatario_id)
            solicitud.estado = "aceptada"
        else:
            solicitud.estado = "rechazada"
        return self.repo.update(solicitud)

    @staticmethod
    def _to_response(solicitud, solicitante) -> SolicitudAmistadResponseDTO:
        return SolicitudAmistadResponseDTO(
            id=solicitud.id,
            solicitante_id=solicitud.solicitante_id,
            destinatario_id=solicitud.destinatario_id,
            estado=solicitud.estado,
            fecha=solicitud.fecha,
            solicitante_nombre=solicitante.nombre,
            solicitante_email=solicitante.email,
        )
