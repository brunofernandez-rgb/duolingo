from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.leccion_dto import CreateLeccionDTO, LeccionResponseDTO
from src.schemas.leccion_schema import CreateLeccionSchema
from src.services.leccion_service import LeccionService
from src.middlewares.admin_middleware import get_admin_user

router = APIRouter(prefix="/lecciones", tags=["lecciones"])


@router.get("/curso/{curso_id}", response_model=list[LeccionResponseDTO])
def get_lecciones_por_curso(curso_id: int, db: Session = Depends(get_db)):
    return LeccionService(db).get_lecciones_por_curso(curso_id)


@router.get("/{leccion_id}", response_model=LeccionResponseDTO)
def get_leccion(leccion_id: int, db: Session = Depends(get_db)):
    result = LeccionService(db).get_by_id(leccion_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lección no encontrada")
    return result


@router.post("/", response_model=LeccionResponseDTO, status_code=status.HTTP_201_CREATED)
def create_leccion(payload: CreateLeccionSchema, db: Session = Depends(get_db), _admin=Depends(get_admin_user)):
    result = LeccionService(db).create(CreateLeccionDTO(**payload.model_dump()))
    if result is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo crear la lección")
    return result


@router.delete("/{leccion_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_leccion(leccion_id: int, db: Session = Depends(get_db), _admin=Depends(get_admin_user)):
    if not LeccionService(db).delete(leccion_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lección no encontrada")
