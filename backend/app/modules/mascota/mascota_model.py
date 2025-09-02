from app.database.connect_db import ConnectDB
from app.modules.usuario.usuario_model import UsuarioModel


class MascotaModel:
    SQL_SELECT_ALL = "SELECT * FROM mascotas"
    SQL_SELECT_BY_ID = "SELECT * FROM mascotas WHERE id = %s"
    SQL_INSERT = """
        INSERT INTO mascotas (nombre, especie, raza, edad, usuario_id)
        VALUES (%s, %s, %s, %s, %s)
    """
    SQL_UPDATE = """
        UPDATE mascotas
        SET nombre = %s, especie = %s, raza = %s, edad = %s, usuario_id = %s
        WHERE id = %s
    """
    SQL_DELETE = "DELETE FROM mascotas WHERE id = %s"
    SQL_SELECT_BY_USUARIO = "SELECT * FROM mascotas WHERE usuario_id = %s"

    def __init__(
        self,
        id: int = 0,
        nombre: str = "",
        especie: str = "",
        raza: str = "",
        edad: int = 0,
        usuario: UsuarioModel | None = None
    ):
        self.id = id
        self.nombre = nombre
        self.especie = especie
        self.raza = raza
        self.edad = edad
        self.usuario = usuario

    def serializar(self) -> dict:
        return {
            "id": self.id,
            "nombre": self.nombre,
            "especie": self.especie,
            "raza": self.raza,
            "edad": self.edad,
            "usuario": self.usuario.serializar()
        }

    @staticmethod
    def deserializar(data: dict) -> "MascotaModel":
        return MascotaModel(
            id=data["id"],
            nombre=data["nombre"],
            especie=data["especie"],
            raza=data["raza"],
            edad=data["edad"],
            usuario=data["usuario"]
        )

    @staticmethod
    def get_all() -> list["MascotaModel"]:
        rows = ConnectDB.read(MascotaModel.SQL_SELECT_ALL)
        if not rows:
            return []

        mascotas = []
        for row in rows:
            usuario = UsuarioModel.get_one(row["usuario_id"])
            mascota = MascotaModel(
                id=row["id"],
                nombre=row["nombre"],
                especie=row["especie"],
                raza=row["raza"],
                edad=row["edad"],
                usuario=UsuarioModel.deserializar(usuario) if usuario else None
            )
            mascotas.append(mascota)
        return mascotas

    @staticmethod
    def get_one(id: int) -> dict | None:
        result = ConnectDB.read(MascotaModel.SQL_SELECT_BY_ID, (id,))
        if not result:
            return None

        row = result[0]
        usuario = UsuarioModel.get_one(row["usuario_id"])

        return MascotaModel(
            id=row["id"],
            nombre=row["nombre"],
            especie=row["especie"],
            raza=row["raza"],
            edad=row["edad"],
            usuario=UsuarioModel.deserializar(usuario) if usuario else None
        ).serializar()

    def create(self) -> bool | None:
        params = (self.nombre, self.especie, self.raza, self.edad, self.usuario.id)
        result = ConnectDB.write(MascotaModel.SQL_INSERT, params)
        self.id = result
        return result if result else False

    def update(self) -> bool | None:
        params = (self.nombre, self.especie, self.raza, self.edad, self.usuario.id, self.id)
        try:
            return ConnectDB.write(MascotaModel.SQL_UPDATE, params)
        except Exception as e:
            raise e

    def delete(self) -> bool | None:
        try:
            return ConnectDB.write(MascotaModel.SQL_DELETE, (self.id,))
        except Exception as e:
            raise e


    @staticmethod
    def get_by_usuario_id(usuario_id: int) -> list["MascotaModel"]:
        rows = ConnectDB.read(MascotaModel.SQL_SELECT_BY_USUARIO, (usuario_id,))
        if not rows:
            return []

        mascotas = []
        for row in rows:
            usuario = UsuarioModel.get_one(row["usuario_id"])
            mascota = MascotaModel(
                id=row["id"],
                nombre=row["nombre"],
                especie=row["especie"],
                raza=row["raza"],
                edad=row["edad"],
                usuario=UsuarioModel.deserializar(usuario) if usuario else None
            )
            mascotas.append(mascota)
        return mascotas