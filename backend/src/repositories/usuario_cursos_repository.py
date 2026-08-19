from sqlalchemy.orm import Session
from src.db.models.usuario_cursos_model import UsuarioCursos


class UsuarioCursosRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, usuario_id: int, curso_id: int) -> UsuarioCursos:
        usuario_curso = UsuarioCursos(usuario_id=usuario_id, curso_id=curso_id)
        self.db.add(usuario_curso)
        self.db.commit()
        self.db.refresh(usuario_curso)
        return usuario_curso

    def get_by_id(self, usuario_id: int, curso_id: int) -> UsuarioCursos | None:
        return (
            self.db.query(UsuarioCursos)
            .filter(
                UsuarioCursos.usuario_id == usuario_id,
                UsuarioCursos.curso_id == curso_id,
            )
            .first()
        )

    def get_by_usuario_id(self, usuario_id: int) -> list[UsuarioCursos]:
        """Obtiene todos los cursos en los que está inscrito un usuario."""
        return self.db.query(UsuarioCursos).filter(UsuarioCursos.usuario_id == usuario_id).all()

    def get_by_curso_id(self, curso_id: int) -> list[UsuarioCursos]:
        """Obtiene todos los usuarios inscritos en un curso."""
        return self.db.query(UsuarioCursos).filter(UsuarioCursos.curso_id == curso_id).all()

    def update(self, usuario_curso: UsuarioCursos) -> UsuarioCursos:
        self.db.add(usuario_curso)
        self.db.commit()
        self.db.refresh(usuario_curso)
        return usuario_curso

    def delete(self, usuario_curso: UsuarioCursos) -> None:
        self.db.delete(usuario_curso)
        self.db.commit()