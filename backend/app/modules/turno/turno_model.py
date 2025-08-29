from typing import TYPE_CHECKING
from app.database.connect_db import ConnectDB

# Solo para type hints (no en runtime)
if TYPE_CHECKING:
    from app.modules.veterinario.veterinario_model import VeterinarioModel
    from app.modules.mascota.mascota_model import MascotaModel

class TurnoModel:
    SQL_INSERT = """
        INSERT INTO turnos (fecha, hora, estado, motivo, mascota_id, veterinario_id)
        VALUES (%s, %s, %s, %s, %s, %s)
    """

    def __init__(
        self,
        mascota: "MascotaModel",
        veterinario: "VeterinarioModel",
        id: int = 0,
        fecha: str = "",
        hora: str = "",
        estado: str = "",
        motivo: str = ""
    ):
        self.id = id
        self.fecha = fecha
        self.hora = hora
        self.estado = estado or "pendiente"
        self.motivo = motivo or ""
        self.mascota = mascota
        self.veterinario = veterinario

    def serializar(self) -> dict:
        return {
            "id": self.id,
            "fecha": self.fecha,
            "hora": self.hora,
            "estado": self.estado,
            "motivo": self.motivo,
            "mascota_id": getattr(self.mascota, "id", None),
            "veterinario_id": getattr(self.veterinario, "id", None),
        }

    def create(self) -> int | None:
        params = (
            self.fecha,
            self.hora,
            self.estado,
            self.motivo,
            self.mascota.id,
            self.veterinario.id,
        )
        return ConnectDB.write(TurnoModel.SQL_INSERT, params)
