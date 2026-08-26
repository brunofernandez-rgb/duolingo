from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.progreso_dto import CreateProgresoDTO, ProgresoCursoDTO, ProgresoResponseDTO
from src.schemas.progreso_schema import CreateProgresoSchema
from src.services.progreso_service import ProgresoService

router = APIRouter(prefix="/progresos", tags=["progresos"])


@router.post("/intentos", response_model=ProgresoResponseDTO, status_code=status.HTTP_201_CREATED)
def registrar_intento(payload: CreateProgresoSchema, db: Session = Depends(get_db)):
    dto = CreateProgresoDTO(**payload.model_dump())
    result = ProgresoService(db).registrar_intento(dto)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Intento inválido, usuario o lección inexistente, o lección anterior incompleta",
        )
    return result


@router.get("/usuarios/{usuario_id}/cursos/{curso_id}", response_model=ProgresoCursoDTO)
def get_progreso_curso(usuario_id: int, curso_id: int, db: Session = Depends(get_db)):
    result = ProgresoService(db).get_progreso_curso(usuario_id, curso_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inscripción al curso no encontrada")
    return result


@router.get("/usuarios/{usuario_id}/actividad", response_model=list[dict])
def get_actividad_diaria(
    usuario_id: int,
    desde: date = Query(...),
    hasta: date = Query(...),
    db: Session = Depends(get_db),
):
    if desde > hasta:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="'desde' debe ser anterior a 'hasta'")
    return ProgresoService(db).get_actividad_diaria(usuario_id, desde, hasta)
