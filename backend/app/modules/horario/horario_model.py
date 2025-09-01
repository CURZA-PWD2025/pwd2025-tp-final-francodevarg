from datetime import datetime
from app.database.connect_db import ConnectDB

class HorarioModel:
    SQL_SELECT_BY_VET_ID = """
        SELECT id, dia_semana, hora
        FROM horarios_laborales
        WHERE veterinario_id = %s
    """

    SQL_SELECT_HORARIOS_POR_DIA = """
        SELECT TIME_FORMAT(hora, '%H:%i') AS hora
        FROM horarios_laborales
        WHERE veterinario_id = %s AND dia_semana = %s
    """

    # Horas ocupadas en la fecha para ese veterinario (pendiente o confirmado)
    SQL_SELECT_HORAS_OCUPADAS = """
        SELECT TIME_FORMAT(hora, '%H:%i') AS hora
        FROM turnos
        WHERE veterinario_id = %s
          AND fecha = %s
          AND estado IN ('pendiente','confirmado')
    """

    SQL_INSERT = """
        INSERT INTO horarios_laborales (veterinario_id, dia_semana, hora)
        VALUES (%s, %s, %s)
    """

    SQL_DELETE_BY_VETERINARIO_ID = """
        DELETE FROM horarios_laborales WHERE veterinario_id = %s
    """

    def __init__(
        self,
        id: int = 0,
        dia_semana: str = "",
        hora: str = "",
        veterinario_id: int = 0
    ):
        self.id = id
        self.dia_semana = dia_semana
        self.hora = hora
        self.veterinario_id = veterinario_id

    def serializar(self) -> dict:
        return {
            "id": self.id,
            "dia_semana": self.dia_semana,
            "hora": str(self.hora)
        }

    @staticmethod
    def get_by_veterinario_id(veterinario_id: int) -> list["HorarioModel"]:
        rows = ConnectDB.read(HorarioModel.SQL_SELECT_BY_VET_ID, (veterinario_id,))
        if not rows:
            return []
        return [
            HorarioModel(
                id=row["id"],
                dia_semana=row["dia_semana"],
                hora=row["hora"],
                veterinario_id=veterinario_id,
            )
            for row in rows
        ]

    def create(self) -> bool | None:
        try:
            self.id = ConnectDB.write(
                HorarioModel.SQL_INSERT,
                (self.veterinario_id, self.dia_semana, self.hora)
            )
            return True if self.id else False
        except Exception as e:
            print(f"[ERROR] No se pudo crear el horario: {str(e)}")
            return None

    @staticmethod
    def get_dia_semana(fecha: str) -> str:
        dias_map = {
            "Monday": "Lunes",
            "Tuesday": "Martes",
            "Wednesday": "Miércoles",
            "Thursday": "Jueves",
            "Friday": "Viernes",
            "Saturday": "Sábado",
            "Sunday": "Domingo",
        }
        fecha_dt = datetime.strptime(fecha, "%Y-%m-%d")
        return dias_map[fecha_dt.strftime('%A')]

    @classmethod
    def get_horarios_por_dia(cls, veterinario_id: int, fecha: str) -> list[str]:
        dia_semana = cls.get_dia_semana(fecha)
        rows = ConnectDB.read(cls.SQL_SELECT_HORARIOS_POR_DIA, (veterinario_id, dia_semana))
        # Devuelve 'HH:MM'
        return [row["hora"] for row in rows] if rows else []

    @classmethod
    def get_horas_ocupadas(cls, veterinario_id: int, fecha: str) -> list[str]:
        rows = ConnectDB.read(cls.SQL_SELECT_HORAS_OCUPADAS, (veterinario_id, fecha))
        return [row["hora"] for row in rows] if rows else []

    @classmethod
    def get_disponibilidad_por_fecha(cls, veterinario_id: int, fecha: str) -> list[dict]:
        horarios = cls.get_horarios_por_dia(veterinario_id, fecha)         # ['09:00','10:00',...]
        horas_ocupadas = cls.get_horas_ocupadas(veterinario_id, fecha)     # ['09:00','11:30',...]
        return [{"hora": h, "disponible": h not in horas_ocupadas} for h in horarios]

    @staticmethod
    def delete_by_veterinario_id(veterinario_id: int) -> bool:
        return ConnectDB.write(HorarioModel.SQL_DELETE_BY_VETERINARIO_ID, (veterinario_id,))
