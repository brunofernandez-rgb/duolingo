from sqlalchemy.orm import Session

from src.dtos.amigos_dto import AmigosResponseDTO, CreateAmigosDTO, RankingAmigosItemDTO
from src.mappers.amigos_mapper import to_amigos_response
from src.repositories.amigos_repository import AmigosRepository
from src.repositories.usuario_repository import UsuariosRepository


class AmigosService:
    def __init__(self, db: Session):
        self.repo = AmigosRepository(db)
        self.usuario_repo = UsuariosRepository(db)

    def create(self, dto: CreateAmigosDTO) -> AmigosResponseDTO | None:
        if dto.usuario_a == dto.usuario_b:
            return None
        if self.repo.get_by_id(dto.usuario_a, dto.usuario_b) or self.repo.get_by_id(dto.usuario_b, dto.usuario_a):
            return None
        self.repo.create(dto.usuario_a, dto.usuario_b)
        res = self.repo.get_by_id_with_usuario(dto.usuario_a, dto.usuario_b)
        return to_amigos_response(res[0], res[1]) if res else None

    def get_amigos(self, usuario_id: int) -> list[AmigosResponseDTO]:
        self.usuario_repo.reset_rachas_vencidas()
        resultados = self.repo.get_amigos_join_usuario(usuario_id)
        return [to_amigos_response(amigo, usuario) for amigo, usuario in resultados]

    def get_ranking_amigos(self, usuario_id: int) -> list[RankingAmigosItemDTO]:
        self.usuario_repo.reset_rachas_vencidas()
        usuario = self.usuario_repo.get_by_id(usuario_id)
        if not usuario:
            return []
        participantes = [usuario] + [usuario_amigo for _, usuario_amigo in self.repo.get_ranking_amigos_join(usuario_id)]
        participantes.sort(key=lambda item: (-item.xp_total, -item.racha_dias, item.id))
        return [
            RankingAmigosItemDTO(
                posicion=posicion,
                usuario_id=participante.id,
                nombre=participante.nombre,
                email=participante.email,
                xp_total=participante.xp_total,
                racha_dias=participante.racha_dias,
            )
            for posicion, participante in enumerate(participantes, start=1)
        ]

    def delete(self, usuario_a: int, usuario_b: int) -> bool:
        amigo = self.repo.get_by_id(usuario_a, usuario_b) or self.repo.get_by_id(usuario_b, usuario_a)
        if not amigo:
            return False
        self.repo.delete(amigo)
        return True
