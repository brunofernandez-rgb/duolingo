from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from src.db.models.leccion_vocabulario_model import LeccionVocabulario

from src.db.connection import Base

class Leccion(Base):
    __tablename__ = "leccion"

    id = Column(Integer, primary_key=True, autoincrement=True)
    curso_id = Column(Integer, ForeignKey("curso.id", ondelete="CASCADE"), nullable=False)
    orden = Column(Integer, nullable=False)
    titulo = Column(String(150), nullable=False)
    xp_recompensa = Column(Integer, nullable=False, default=0, server_default="0")
    vocabulario = relationship(
        LeccionVocabulario,
        cascade="all, delete-orphan",
        order_by="LeccionVocabulario.id",
    )