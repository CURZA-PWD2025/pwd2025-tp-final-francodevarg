from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash
from app.modules.usuario.usuario_model import UsuarioModel as Usuario

class AuthModel:

    @staticmethod
    def login(email: str, password: str) -> dict:
        usuario_data = Usuario.get_user_by_email(email)
        if not usuario_data:
            return {'mensaje': 'Usuario no registrado'},401

        usuario = Usuario(**usuario_data)
        if not usuario.check_password(password):
            return {'mensaje': 'Credenciales inválidas'},401

        jwt = create_access_token(
            identity=usuario.email,
            additional_claims={'tipo': usuario.tipo}
        )
        return {
            **usuario.serializar(),
            'jwt': jwt,
        },200
        
    @staticmethod
    def register(email: str, nombre: str, password: str, tipo: str) -> dict:
        existente = Usuario.get_user_by_email(email)
        if existente:
            return {"mensaje": "No se puede registrar: El usuario ya registrado con el email." + email}, 409

        password_hash = generate_password_hash(password)

        Usuario.insert_user(nombre, email, password_hash, tipo)
        return {"mensaje": "Usuario registrado correctamente"}, 201