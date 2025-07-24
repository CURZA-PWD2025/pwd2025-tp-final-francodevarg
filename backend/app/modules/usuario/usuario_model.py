from werkzeug.security import check_password_hash
from app.database.connect_db import ConnectDB

class UsuarioModel:
    def __init__(self,  id:int=0, nombre:str="", email:str="", password:str="", tipo:str=""):
        self.id = id
        self.nombre = nombre
        self.email = email
        self.password = password
        self.tipo = tipo

    @staticmethod
    def get_user_by_email(email: str):
        query = "SELECT * FROM usuarios WHERE email = %s"
        result = ConnectDB.read(query, (email,))
        print(f"Resultado de la consulta por email: {result}")
        try:
            if result:
                usuario = UsuarioModel.deserializar(result[0])
                return usuario.serializar()
            else:
                return None
        except Exception as e:
            print(f"Error al obtener usuario por email: {e}")

    @staticmethod
    def insert_user(nombre: str, email: str, password_hash: str, tipo: str) -> bool:
        if tipo not in ("admin", "cliente"):
            raise ValueError("Tipo de usuario inválido. Debe ser 'admin' o 'cliente'.")

        query = """
            INSERT INTO usuarios (nombre, email, password, tipo)
            VALUES (%s, %s, %s, %s)
        """

        try:
            ConnectDB.write(query, (nombre, email, password_hash, tipo))
            return True
        except Exception as e:
            # Podés loguear el error acá si querés
            print(f"[insert_user] Error al insertar usuario: {e}")
            return False

    def check_password(self, plain_password: str) -> bool:
        return check_password_hash(self.password, plain_password)

    @staticmethod
    def deserializar(data: dict) -> 'UsuarioModel':
        return UsuarioModel(
            id=data.get('id', 0),
            nombre=data.get('nombre', ""),
            email=data.get('email', ""),
            password=data.get('password', ""),
            tipo=data.get('tipo', "")
        )

    def serializar(self) -> dict:
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "password": self.password,
            "tipo": self.tipo
        }
