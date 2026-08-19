from sqlalchemy import Column, ForeignKey, Integer, String, ForeignKey

from src.db.connection import Base

class Curso(Base):
    __tablename__ = "curso"

    id = Column(Integer, primary_key=True, autoincrement=True)
    idioma_id = Column(Integer, ForeignKey("idioma.id", ondelete="CASCADE"), nullable=False)
    nivel = Column(String(50), nullable=False)