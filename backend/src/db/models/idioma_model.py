from sqlalchemy import Column, Integer, String

from src.db.connection import Base


class Idioma(Base):
    __tablename__ = "idioma"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(50), nullable=False)
    codigo = Column(String(10), unique=True, nullable=False)