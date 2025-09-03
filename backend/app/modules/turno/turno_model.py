from typing import TYPE_CHECKING
from app.database.connect_db import ConnectDB

class TurnoModel:
    SQL_INSERT = """
        INSERT INTO turnos (fecha, hora, estado, motivo, mascota_id, veterinario_id)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    SQL_SELECT_BY_USER = """
        SELECT 
            t.id AS turno_id, t.fecha, t.hora, t.estado, t.motivo,
            m.id AS mascota_id, m.nombre AS mascota_nombre, m.especie AS mascota_especie,
            v.id AS veterinario_id, v.nombre AS veterinario_nombre, v.especialidad AS veterinario_especialidad
        FROM turnos t
        INNER JOIN mascotas m ON m.id = t.mascota_id
        INNER JOIN veterinarios v ON v.id = t.veterinario_id
        WHERE m.usuario_id = %s
        ORDER BY t.fecha, t.hora
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
    
    @staticmethod
    def get_by_user(user_id: int) -> list[dict]:
        from app.modules.mascota.mascota_model import MascotaModel
        from app.modules.veterinario.veterinario_model import VeterinarioModel
        rows = ConnectDB.read(TurnoModel.SQL_SELECT_BY_USER, (user_id,))
        if not rows:
            return []

        turnos: list[dict] = []
        for row in rows:
            # instanciás las entidades relacionadas
            mascota = MascotaModel.get_one(row["mascota_id"])
            veterinario = VeterinarioModel.get_one(row["veterinario_id"])
            del veterinario["horarios"]

            # armás el dict limpio
            turno = {
                "id": row["turno_id"],
                "fecha": row["fecha"].isoformat() if row["fecha"] else None,
                "hora": TurnoModel._format_hora(row["hora"]),
                "estado": row["estado"],
                "motivo": row["motivo"],
                "mascota": mascota,
                "veterinario": veterinario,
            }
            turnos.append(turno)

        return turnos

    @staticmethod
    def _format_hora(td):
        """Convierte timedelta a HH:MM"""
        if not td:
            return None
        total_seconds = int(td.total_seconds())
        horas = total_seconds // 3600
        minutos = (total_seconds % 3600) // 60
        return f"{horas:02d}:{minutos:02d}"
