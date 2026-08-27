from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func

from src.db.connection import Base


class SolicitudAmistad(Base):
    __tablename__ = "solicitud_amistad"

    id = Column(Integer, primary_key=True, autoincrement=True)
    solicitante_id = Column(Integer, ForeignKey("usuario.id", ondelete="CASCADE"), nullable=False)
    destinatario_id = Column(Integer, ForeignKey("usuario.id", ondelete="CASCADE"), nullable=False)
    estado = Column(String(20), nullable=False, default="pendiente", server_default="pendiente")
    fecha = Column(DateTime, nullable=False, server_default=func.now())
