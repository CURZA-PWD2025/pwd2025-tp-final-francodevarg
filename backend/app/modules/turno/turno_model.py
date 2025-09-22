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
        AND (t.fecha > CURRENT_DATE 
            OR (t.fecha = CURRENT_DATE AND t.hora >= CURRENT_TIME))
        ORDER BY t.fecha ASC, t.hora ASC
    """

    SQL_UPDATE_ESTADO = """
        UPDATE turnos 
        SET estado = %s
        WHERE id = %s
    """

    SQL_SELECT_BY_FECHA = """
        SELECT 
            t.id AS turno_id, t.fecha, t.hora, t.estado, t.motivo,
            m.id AS mascota_id, m.nombre AS mascota_nombre, m.especie AS mascota_especie,
            v.id AS veterinario_id, v.nombre AS veterinario_nombre, v.especialidad AS veterinario_especialidad
        FROM turnos t
        INNER JOIN mascotas m ON m.id = t.mascota_id
        INNER JOIN veterinarios v ON v.id = t.veterinario_id
        WHERE t.fecha = %s
        ORDER BY t.hora ASC
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
        self.estado = estado or "Pendiente"
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
    def update_estado(turno_id: int, nuevo_estado: str) -> bool:
        params = (nuevo_estado, turno_id)
        updated = ConnectDB.write(TurnoModel.SQL_UPDATE_ESTADO, params)
        print(updated)
        print(bool(updated))
        return bool(updated)
    
    @staticmethod
    def get_by_fecha(fecha_str: str) -> list[dict]:
        from datetime import datetime
        from app.modules.mascota.mascota_model import MascotaModel
        from app.modules.veterinario.veterinario_model import VeterinarioModel

        # convertir string DD-MM-YYYY a objeto date
        try:
            fecha = datetime.strptime(fecha_str, "%d-%m-%Y").date()
        except ValueError:
            return []

        rows = ConnectDB.read(TurnoModel.SQL_SELECT_BY_FECHA, (fecha,))
        if not rows:
            return []

        turnos: list[dict] = []
        for row in rows:
            mascota = MascotaModel.get_one(row["mascota_id"])
            veterinario = VeterinarioModel.get_one(row["veterinario_id"])
            # limpio horarios si existe
            if "horarios" in veterinario:
                del veterinario["horarios"]

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
