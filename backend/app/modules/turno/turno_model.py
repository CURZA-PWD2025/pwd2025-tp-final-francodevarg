from app.database.connect_db import ConnectDB


class TurnoModel:
    SQL_SELECT_TURNOS_OCUPADOS = """
        SELECT hora
        FROM turnos
        WHERE veterinario_id = %s AND fecha = %s AND estado != 'cancelado'
    """

    @staticmethod
    def get_horas_ocupadas(veterinario_id: int, fecha: str) -> list[str]:
        rows = ConnectDB.read(TurnoModel.SQL_SELECT_TURNOS_OCUPADOS, (veterinario_id, fecha))
        return [str(row["hora"])[:5] for row in rows] if rows else []  # Truncar a "HH:MM"
