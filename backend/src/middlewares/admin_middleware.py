from fastapi import Depends, Header
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.repositories.usuario_repository import UsuariosRepository
from src.utils.errors import UnauthorizedError
from src.utils.jwt import decode_token

ADMIN_EMAIL = "admin@gmail.com"


def get_admin_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise UnauthorizedError("Missing or malformed Authorization header")
    payload = decode_token(authorization.split(" ", 1)[1].strip())
    user_id = payload.get("sub")
    user = UsuariosRepository(db).get_by_id(int(user_id)) if user_id is not None else None
    if user is None or user.email.lower() != ADMIN_EMAIL:
        raise UnauthorizedError("Admin access required")
    return user
