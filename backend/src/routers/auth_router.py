from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.auth_dto import LoginDTO, TokenDTO
from src.schemas.auth_schema import LoginSchema, TokenSchema
from src.services.auth_service import AuthService
from src.dtos.usuarios_dto import CreateUsuarioDTO
from src.schemas.auth_register_schema import RegisterSchema
from src.services.usuario_service import UsuarioService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenSchema)
def login(payload: LoginSchema, db: Session = Depends(get_db)):
    dto = LoginDTO(**payload.model_dump())
    token: TokenDTO = AuthService(db).login(dto)
    return TokenSchema(**token.model_dump())


@router.post("/register", response_model=TokenSchema, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterSchema, db: Session = Depends(get_db)):
    usuario = UsuarioService(db).create(
        CreateUsuarioDTO(email=str(payload.email), nombre=payload.nombre), payload.password
    )
    if usuario is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El email ya está registrado")
    return AuthService(db).login(LoginDTO(email=str(payload.email), password=payload.password))
