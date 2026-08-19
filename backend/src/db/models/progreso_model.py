from sqlalchemy import Column, ForeignKey, Integer, Boolean, DateTime, func

from src.db.connection import Base

class Progreso(Base):
    __tablename__ = "progreso"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id", ondelete="CASCADE"), nullable=False)
    leccion_id = Column(Integer, ForeignKey("leccion.id", ondelete="CASCADE"), nullable=False)
    puntaje = Column(Integer, nullable=False, default=0, server_default="0")
    completada = Column(Boolean, nullable=False, default=False, server_default="false")
    fecha = Column(DateTime, nullable=False, server_default=func.now())