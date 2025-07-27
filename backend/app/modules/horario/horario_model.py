from app.database.connect_db import ConnectDB
from datetime import datetime
import calendar

class HorarioModel:
    SQL_INSERT = """
        INSERT INTO horarios_laborales (veterinario_id, dia_semana, hora)
        VALUES (%s, %s, %s)
    """

    SQL_DISPONIBILIDAD_POR_FECHA = """
        SELECT 
            hl.hora,
            CASE 
                WHEN t.id IS NULL THEN 0
                ELSE 1
            END AS ocupado
        FROM horarios_laborales hl
        LEFT JOIN turnos t 
            ON hl.veterinario_id = t.veterinario_id 
            AND hl.hora = t.hora
            AND t.fecha = %s
        WHERE hl.veterinario_id = %s
          AND hl.dia_semana = %s
        ORDER BY hl.hora
    """

    # Insertar varios horarios por día
    @staticmethod
    def insert_bulk(veterinario_id: int, dias_horas: dict[str, list[str]]):
        # días_horas = {"Lunes": ["08:00", "09:00"], "Martes": ["10:00"]}
        count = 0
        for dia, horas in dias_horas.items():
            dia_lower = dia.lower()
            for hora in horas:
                result = ConnectDB.write(HorarioModel.SQL_INSERT, (veterinario_id, dia_lower, hora))
                if result:
                    count += 1
        return count

from datetime import datetime
from app.database.connect_db import ConnectDB

class HorarioModel:
    SQL_DISPONIBILIDAD_POR_FECHA = """
        SELECT 
            hl.hora,
            t.id IS NOT NULL AS ocupado
        FROM horarios_laborales hl
        LEFT JOIN turnos t 
            ON t.veterinario_id = hl.veterinario_id
           AND t.hora = hl.hora
           AND t.fecha = %s
        WHERE hl.veterinario_id = %s
          AND hl.dia_semana = %s
        ORDER BY hl.hora;
    """

    @staticmethod
    def get_disponibilidad_por_fecha(veterinario_id: int, fecha_str: str):
        """
        Devuelve lista de horarios disponibles y ocupados en una fecha específica.
        Formato de respuesta:
            [{"hora": "09:00", "ocupado": True}, ...]
        """
        # Validación de fecha
        try:
            fecha = datetime.strptime(fecha_str, "%Y-%m-%d").date()
        except (ValueError, TypeError):
            raise ValueError("Fecha inválida. Formato requerido: YYYY-MM-DD")

        # Validación de ID
        if not isinstance(veterinario_id, int) or veterinario_id <= 0:
            raise ValueError("ID de veterinario inválido")

        # Traducción segura del día de la semana
        traduccion_dias = {
            "monday": "lunes",
            "tuesday": "martes",
            "wednesday": "miércoles",
            "thursday": "jueves",
            "friday": "viernes",
            "saturday": "sábado",
            "sunday": "domingo"
        }
        dia_en_ingles = fecha.strftime("%A").lower()
        dia_semana = traduccion_dias.get(dia_en_ingles)

        if not dia_semana:
            raise ValueError("No se pudo determinar el día de la semana")

        try:
            rows = ConnectDB.read(
                HorarioModel.SQL_DISPONIBILIDAD_POR_FECHA,
                (fecha_str, veterinario_id, dia_semana)
            )
        except Exception as e:
            raise Exception(f"Error al consultar la disponibilidad: {str(e)}")

        if not rows:
            return []  # No hay horarios definidos para ese día

        return [
            {
                "hora": row["hora"].strftime("%H:%M") if hasattr(row["hora"], 'strftime') else str(row["hora"]),
                "ocupado": bool(row["ocupado"])
            } for row in rows
        ]

