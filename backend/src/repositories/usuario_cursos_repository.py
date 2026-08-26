from sqlalchemy.orm import Session
from src.db.models.curso_model import Curso
from src.db.models.idioma_model import Idioma
from src.db.models.usuario_cursos_model import UsuarioCurso


class UsuarioCursosRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, usuario_id: int, curso_id: int) -> UsuarioCurso:
        usuario_curso = UsuarioCurso(usuario_id=usuario_id, curso_id=curso_id)
        self.db.add(usuario_curso)
        self.db.commit()
        self.db.refresh(usuario_curso)
        return usuario_curso

    def get_by_id(self, usuario_id: int, curso_id: int) -> UsuarioCurso | None:
        return (
            self.db.query(UsuarioCurso)
            .filter(
                UsuarioCurso.usuario_id == usuario_id,
                UsuarioCurso.curso_id == curso_id,
            )
            .first()
        )

    def get_by_usuario_id(self, usuario_id: int) -> list[UsuarioCurso]:
        """Obtiene todos los cursos en los que está inscrito un usuario."""
        return self.db.query(UsuarioCurso).filter(UsuarioCurso.usuario_id == usuario_id).all()

    def get_by_curso_id(self, curso_id: int) -> list[UsuarioCurso]:
        """Obtiene todos los usuarios inscritos en un curso."""
        return self.db.query(UsuarioCurso).filter(UsuarioCurso.curso_id == curso_id).all()

    def get_by_id_with_curso_idioma(self, usuario_id: int, curso_id: int):
        return (
            self.db.query(UsuarioCurso, Curso, Idioma)
            .join(Curso, UsuarioCurso.curso_id == Curso.id)
            .join(Idioma, Curso.idioma_id == Idioma.id)
            .filter(
                UsuarioCurso.usuario_id == usuario_id,
                UsuarioCurso.curso_id == curso_id,
            )
            .first()
        )

    def get_by_usuario_id_with_join(self, usuario_id: int):
        return (
            self.db.query(UsuarioCurso, Curso, Idioma)
            .join(Curso, UsuarioCurso.curso_id == Curso.id)
            .join(Idioma, Curso.idioma_id == Idioma.id)
            .filter(UsuarioCurso.usuario_id == usuario_id)
            .all()
        )

    def update(self, usuario_curso: UsuarioCurso) -> UsuarioCurso:
        self.db.add(usuario_curso)
        self.db.commit()
        self.db.refresh(usuario_curso)
        return usuario_curso

    def delete(self, usuario_curso: UsuarioCurso) -> None:
        self.db.delete(usuario_curso)
        self.db.commit()
