from sqlalchemy import Column, DateTime, ForeignKey, Integer, DateTime, func

from src.db.connection import Base


class UsuarioCurso(Base):
    __tablename__ = "usuario_cursos"

    usuario_id = Column(Integer, ForeignKey("usuario.id", ondelete="CASCADE"), primary_key=True)
    curso_id = Column(Integer, ForeignKey("curso.id", ondelete="CASCADE"), primary_key=True)
    fecha_inscripcion = Column(DateTime, nullable=False, server_default=func.now())