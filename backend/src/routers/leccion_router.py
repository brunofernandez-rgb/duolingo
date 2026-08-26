from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.leccion_dto import CreateLeccionDTO, LeccionResponseDTO
from src.schemas.leccion_schema import CreateLeccionSchema
from src.services.leccion_service import LeccionService

router = APIRouter(prefix="/lecciones", tags=["lecciones"])


@router.post("/", response_model=LeccionResponseDTO, status_code=status.HTTP_201_CREATED)
def create_leccion(payload: CreateLeccionSchema, db: Session = Depends(get_db)):
    result = LeccionService(db).create(CreateLeccionDTO(**payload.model_dump()))
    if result is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo crear la lección")
    return result


@router.get("/curso/{curso_id}", response_model=list[LeccionResponseDTO])
def get_lecciones_por_curso(curso_id: int, db: Session = Depends(get_db)):
    return LeccionService(db).get_lecciones_por_curso(curso_id)


@router.delete("/{leccion_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_leccion(leccion_id: int, db: Session = Depends(get_db)):
    if not LeccionService(db).delete(leccion_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lección no encontrada")
