from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.schemas.solicitud_amistad_schema import CrearSolicitudPorEmailSchema, ResponderSolicitudSchema
from src.services.solicitud_amistad_service import SolicitudAmistadService

router = APIRouter(prefix="/solicitudes-amistad", tags=["solicitudes-amistad"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def crear_solicitud(payload: CrearSolicitudPorEmailSchema, db: Session = Depends(get_db)):
    result = SolicitudAmistadService(db).create_by_email(payload.solicitante_id, str(payload.email))
    if result is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo crear la solicitud")
    return result


@router.get("/recibidas/{usuario_id}")
def solicitudes_recibidas(usuario_id: int, db: Session = Depends(get_db)):
    return SolicitudAmistadService(db).get_received(usuario_id)


@router.patch("/{solicitud_id}")
def responder_solicitud(
    solicitud_id: int,
    payload: ResponderSolicitudSchema,
    db: Session = Depends(get_db),
):
    result = SolicitudAmistadService(db).respond(solicitud_id, payload.usuario_id, payload.aceptar)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solicitud no encontrada")
    return result
