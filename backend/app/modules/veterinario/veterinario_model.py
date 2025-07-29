from app.database.connect_db import ConnectDB
from app.modules.horario.horario_model import HorarioModel

class VeterinarioModel:
    SQL_SELECT_ALL = "SELECT * FROM veterinarios"
    SQL_SELECT_BY_ID = "SELECT * FROM veterinarios WHERE id = %s"
    SQL_INSERT = "INSERT INTO veterinarios (nombre, especialidad, email, telefono) VALUES (%s, %s, %s, %s)"
    SQL_UPDATE = "UPDATE veterinarios SET nombre = %s, especialidad = %s, email = %s, telefono = %s WHERE id = %s"
    SQL_DELETE = "DELETE FROM veterinarios WHERE id = %s"

    def __init__(
        self,
        id: int = 0,
        nombre: str = "",
        especialidad: str = "",
        email: str = "",
        telefono: str = "",
        horarios: list[HorarioModel] = []
    ):
        self.id = id
        self.nombre = nombre
        self.especialidad = especialidad
        self.email = email
        self.telefono = telefono
        self.horarios = horarios

    def serializar(self) -> dict:
        return {
            'id': self.id,
            'nombre': self.nombre,
            'especialidad': self.especialidad,
            'email': self.email,
            'telefono': self.telefono,
            'horarios': [h.serializar() for h in self.horarios]
        }

    @staticmethod
    def deserializar(data: dict) -> "VeterinarioModel":
        return VeterinarioModel(
            id=data['id'],
            nombre=data['nombre'],
            especialidad=data['especialidad'],
            email=data['email'],
            telefono=data['telefono'],
            horarios=[HorarioModel(**h) for h in data.get("horarios", [])]
        )

    @staticmethod
    def get_all() -> list["VeterinarioModel"]:
        rows = ConnectDB.read(VeterinarioModel.SQL_SELECT_ALL)
        if not rows:
            return []

        veterinarios = []
        for row in rows:
            horarios = HorarioModel.get_by_veterinario_id(row["id"])
            veterinario = VeterinarioModel(
                id=row["id"],
                nombre=row["nombre"],
                especialidad=row["especialidad"],
                email=row["email"],
                telefono=row["telefono"],
                horarios=horarios
            )
            veterinarios.append(veterinario)
        return veterinarios
    
    @staticmethod
    def get_one(id: int) -> dict:
        result = ConnectDB.read(VeterinarioModel.SQL_SELECT_BY_ID, (id,))
        if not result:
            return None

        row = result[0]
        horarios = HorarioModel.get_by_veterinario_id(row["id"])

        return VeterinarioModel(
            id=row["id"],
            nombre=row["nombre"],
            especialidad=row["especialidad"],
            email=row["email"],
            telefono=row["telefono"],
            horarios=horarios
        ).serializar()
    
    def create(self) -> bool | None:
        params = (self.nombre, self.especialidad, self.email, self.telefono)
        result = ConnectDB.write(VeterinarioModel.SQL_INSERT, params)
        return result if result else False

