from sqlalchemy import Column, Integer, String, Text

from src.db.connection import Base

class Insignia(Base):
    __tablename__ = "insignia"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=True)
    criterio = Column(Text, nullable=False)