from app.database.connect_db import ConnectDB

class VeterinarioModel:
    SQL_SELECT_ALL = "SELECT * FROM veterinarios"
    SQL_SELECT_BY_ID = "SELECT * FROM veterinarios WHERE id = %s"
    SQL_INSERT = "INSERT INTO veterinarios (nombre, especialidad, email, telefono) VALUES (%s, %s, %s, %s)"
    SQL_UPDATE = "UPDATE veterinarios SET nombre = %s, especialidad = %s, email = %s, telefono = %s WHERE id = %s"
    SQL_DELETE = "DELETE FROM veterinarios WHERE id = %s"

    def __init__(self, id: int = 0, nombre: str = "", especialidad: str = "", email: str = "", telefono: str = ""):
        self.id = id
        self.nombre = nombre
        self.especialidad = especialidad
        self.email = email
        self.telefono = telefono

    def serializar(self) -> dict:
        return {
            'id': self.id,
            'nombre': self.nombre,
            'especialidad': self.especialidad,
            'email': self.email,
            'telefono': self.telefono
        }

    @staticmethod
    def deserializar(data: dict):
        return VeterinarioModel(
            id=data['id'],
            nombre=data['nombre'],
            especialidad=data['especialidad'],
            email=data['email'],
            telefono=data['telefono']
        )

    @staticmethod
    def get_all() -> list[dict]:
        rows = ConnectDB.read(VeterinarioModel.SQL_SELECT_ALL)
        return rows if rows else []

    @staticmethod
    def get_one(id: int) -> dict | None:
        result = ConnectDB.read(VeterinarioModel.SQL_SELECT_BY_ID, (id,))
        return result[0] if result else None

    def create(self) -> int | None:
        try:
            self.id = ConnectDB.write(
                VeterinarioModel.SQL_INSERT,
                (self.nombre, self.especialidad, self.email, self.telefono)
            )
            return self.id
        except Exception as e:
            print(f"Error creating Veterinario: {e}")
            return None

    def update(self) -> bool | None:
        result = ConnectDB.write(
            VeterinarioModel.SQL_UPDATE,
            (self.nombre, self.especialidad, self.email, self.telefono, self.id)
        )
        return result > 0 or None

    @staticmethod
    def delete(id: int) -> bool | None:
        try:
            result = ConnectDB.write(VeterinarioModel.SQL_DELETE, (id,))
            return result > 0 if result is not None else None
        except Exception as e:
            return None
