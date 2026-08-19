from sqlalchemy import Column, DateTime, Integer, String

from src.db.connection import Base


class Usuario(Base):
    __tablename__ = "usuario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False)
    nombre = Column(String(100), nullable=False)
    xp_total = Column(Integer, nullable=False, default=0)
    racha_dias = Column(Integer, nullable=False, default=0)
    fecha_ultima_actividad = Column(DateTime, nullable=True)