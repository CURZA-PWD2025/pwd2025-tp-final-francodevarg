from werkzeug.security import check_password_hash
from app.database.connect_db import ConnectDB

class UsuarioModel:
    
    SQL_SELECT_BY_ID = "SELECT * FROM usuarios WHERE id = %s"
    SQL_SELECT_BY_EMAIL = "SELECT * FROM usuarios WHERE email = %s"
    SQL_INSERT_USER = "INSERT INTO usuarios (nombre, email, password, tipo) VALUES (%s, %s, %s, %s)"

    
    def __init__(self,  id:int=0, nombre:str="", email:str="", password:str="", tipo:str=""):
        self.id = id
        self.nombre = nombre
        self.email = email
        self.password = password
        self.tipo = tipo

    def serializar(self) -> dict:
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "password": self.password,
            "tipo": self.tipo
        }
        
    @staticmethod
    def deserializar(data: dict) -> 'UsuarioModel':
        return UsuarioModel(
            id=data['id'],
            nombre=data['nombre'],
            email=data['email'],
            password=data['password'],
            tipo=data['tipo']
        )
        
    @staticmethod
    def get_user_by_email(email: str) -> dict:
        result = ConnectDB.read(UsuarioModel.SQL_SELECT_BY_EMAIL, (email,))
        try:
            if result:
                usuario = UsuarioModel.deserializar(result[0])
                return usuario.serializar()
            else:
                return None
        except Exception as e:
            print(f"Error al obtener usuario por email: {e}")

    @staticmethod
    def get_one(id: int) -> dict:
        try:
            result = ConnectDB.read(UsuarioModel.SQL_SELECT_BY_ID, (id,))
            if result:
                usuario = UsuarioModel.deserializar(result[0])
                return usuario.serializar()
            return {"error": "Usuario no encontrado"}
        except Exception as e:
            print(f"Error al obtener usuario: {e}")
            return {"error": f"Error al obtener usuario: {e}"}
    
    def create(self) -> bool:
        try:
            lastId =ConnectDB.write(UsuarioModel.SQL_INSERT_USER, (self.nombre, self.email, self.password, self.tipo))
            self.id = lastId
            return True
        except Exception as e:
            print(f"[insert_user] Error al insertar usuario: {e}")
            return False


    def check_password(self, plain_password: str) -> bool:
        return check_password_hash(self.password, plain_password)
