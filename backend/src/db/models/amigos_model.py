from sqlalchemy import Column, Integer, DateTime, ForeignKey, PrimaryKeyConstraint, CheckConstraint, func

from src.db.connection import Base

class Amigos(Base):
    __tablename__ = "amigos"

    usuario_a = Column(Integer, ForeignKey("usuario.id", ondelete="CASCADE"), nullable=False)
    usuario_b = Column(Integer, ForeignKey("usuario.id", ondelete="CASCADE"), nullable=False)
    fecha = Column(DateTime, nullable=False, server_default=func.now())

    __table_args__ = (
        PrimaryKeyConstraint("usuario_a", "usuario_b"),
        CheckConstraint("usuario_a <> usuario_b", name="chk_amigos_diferentes"),
    )