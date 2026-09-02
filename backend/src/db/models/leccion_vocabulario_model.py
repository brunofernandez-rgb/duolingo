from sqlalchemy import Column, ForeignKey, Integer, String

from src.db.connection import Base


class LeccionVocabulario(Base):
    __tablename__ = "leccion_vocabulario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    leccion_id = Column(Integer, ForeignKey("leccion.id", ondelete="CASCADE"), nullable=False)
    emoji = Column(String(10), nullable=False)
    fuente = Column(String(255), nullable=False)
    traduccion_en = Column(String(255), nullable=False)
    traduccion_fr = Column(String(255), nullable=False)
    traduccion_de = Column(String(255), nullable=False)
    traduccion_it = Column(String(255), nullable=False)
    traduccion_pt = Column(String(255), nullable=False)
