from sqlalchemy import Column, DateTime, ForeignKey, Integer, DateTime, func

from src.db.connection import Base

class UsuarioInsignia(Base):
    __tablename__ = "usuario_insignias"

    usuario_id = Column(Integer, ForeignKey("usuario.id", ondelete="CASCADE"), primary_key=True)
    insignia_id = Column(Integer, ForeignKey("insignia.id", ondelete="CASCADE"), primary_key=True)
    fecha = Column(DateTime, nullable=False, server_default=func.now())

