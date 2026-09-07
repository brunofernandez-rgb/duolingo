from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.curso_dto import CreateCursoDTO, CursoResponseDTO
from src.schemas.curso_schema import CreateCursoSchema
from src.services.curso_service import CursoService
from src.services.leccion_service import LeccionService
from src.dtos.leccion_dto import LeccionResponseDTO
from src.middlewares.admin_middleware import get_admin_user

router = APIRouter(prefix="/cursos", tags=["cursos"])


@router.get("/", response_model=list[CursoResponseDTO])
def list_cursos(db: Session = Depends(get_db)):
    return CursoService(db).list_all()


@router.post("/", response_model=CursoResponseDTO, status_code=status.HTTP_201_CREATED)
def create_curso(payload: CreateCursoSchema, db: Session = Depends(get_db), _admin=Depends(get_admin_user)):
    result = CursoService(db).create(CreateCursoDTO(**payload.model_dump()))
    if result is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo crear el curso")
    return result


@router.get("/{curso_id}/lecciones", response_model=list[LeccionResponseDTO])
def get_lecciones_del_curso(curso_id: int, db: Session = Depends(get_db)):
    """Returns a course's lessons in their unique position order."""
    if CursoService(db).get_by_id(curso_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Curso no encontrado")
    return LeccionService(db).get_lecciones_por_curso(curso_id)


@router.get("/{curso_id}", response_model=CursoResponseDTO)
def get_curso(curso_id: int, db: Session = Depends(get_db)):
    result = CursoService(db).get_by_id(curso_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Curso no encontrado")
    return result


@router.delete("/{curso_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_curso(curso_id: int, db: Session = Depends(get_db), _admin=Depends(get_admin_user)):
    if not CursoService(db).delete(curso_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Curso no encontrado")
