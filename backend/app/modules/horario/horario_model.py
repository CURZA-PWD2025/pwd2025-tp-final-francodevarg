from app.database.connect_db import ConnectDB

class HorarioModel:
    SQL_SELECT_BY_VET_ID = """
        SELECT id, dia_semana, hora
        FROM horarios_laborales
        WHERE veterinario_id = %s
    """

    SQL_INSERT = """
        INSERT INTO horarios_laborales (veterinario_id, dia_semana, hora)
        VALUES (%s, %s, %s)
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
        rows = ConnectDB.read(
            HorarioModel.SQL_SELECT_BY_VET_ID,
            (veterinario_id,)
        )
        if not rows:
            return []

        return [
            HorarioModel(
                id=row["id"],
                dia_semana=row["dia_semana"],
                hora=row["hora"]
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
