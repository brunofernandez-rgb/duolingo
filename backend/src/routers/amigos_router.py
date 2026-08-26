from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.amigos_dto import AmigosResponseDTO, CreateAmigosDTO
from src.schemas.amigos_schema import CreateAmigosSchema
from src.services.amigos_service import AmigosService

router = APIRouter(prefix="/amigos", tags=["amigos"])


@router.post("/", response_model=AmigosResponseDTO, status_code=status.HTTP_201_CREATED)
def create_amistad(payload: CreateAmigosSchema, db: Session = Depends(get_db)):
    dto = CreateAmigosDTO(usuario_a=payload.usuario_a, usuario_b=payload.usuario_b)
    result = AmigosService(db).create(dto)
    if result is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="La amistad no se pudo crear o ya existe")
    return result


@router.get("/usuarios/{usuario_id}/ranking", response_model=list[AmigosResponseDTO])
def get_ranking_amigos(usuario_id: int, db: Session = Depends(get_db)):
    return AmigosService(db).get_ranking_amigos(usuario_id)


@router.get("/usuarios/{usuario_id}", response_model=list[AmigosResponseDTO])
def get_amigos(usuario_id: int, db: Session = Depends(get_db)):
    return AmigosService(db).get_amigos(usuario_id)


@router.delete("/{usuario_a}/{usuario_b}", status_code=status.HTTP_204_NO_CONTENT)
def delete_amistad(usuario_a: int, usuario_b: int, db: Session = Depends(get_db)):
    if not AmigosService(db).delete(usuario_a, usuario_b):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Amistad no encontrada")
