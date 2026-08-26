from sqlalchemy.orm import Session

from src.dtos.auth_dto import LoginDTO, TokenDTO
from src.repositories.usuario_repository import UsuariosRepository
from src.utils.errors import UnauthorizedError
from src.utils.hash import verify_password
from src.utils.hash import hash_password
from src.utils.jwt import create_access_token


class AuthService:
    def __init__(self, db: Session):
        self.repo = UsuariosRepository(db)

    def login(self, dto: LoginDTO) -> TokenDTO:
        user = self.repo.get_by_email(dto.email)
        if not user or not verify_password(dto.password, user.password_hash):
            raise UnauthorizedError("Invalid credentials")

        token = create_access_token({"sub": str(user.id), "email": user.email})
        return TokenDTO(access_token=token)

    def reset_password(self, email: str, password: str) -> bool:
        user = self.repo.get_by_email(email)
        if not user:
            return False
        user.password_hash = hash_password(password)
        self.repo.update(user)
        return True
