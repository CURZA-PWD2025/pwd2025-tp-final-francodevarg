from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash
from .auth_model import AuthModel

class AuthController:

    @staticmethod
    def register(data: dict):
        email = data.get("email")
        nombre = data.get("nombre")
        password = data.get("password")
        tipo = data.get("tipo")

        if not all([email, nombre, password, tipo]):
            return {"mensaje": "Los campos son obligatorios"}, 400

        return AuthModel.register(email, nombre, password, tipo)
    
    @staticmethod
    def login(data: dict):
        email = data.get("email")
        password = data.get("password")

        if not all([password,email]):
            return {"mensaje": "Email y password requeridos"}, 400

        return AuthModel.login(email, password)

