from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.modules.usuario.usuario_model import UsuarioModel
 
def role_required(*roles):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
                identity = get_jwt_identity()
                print(f"[DEBUG] Identity: {identity}")

                user = UsuarioModel.get_user_by_email(identity)
                print(f"[DEBUG] Usuario encontrado: {user}")

                if user is None:
                    return jsonify({"error": "Usuario no encontrado"}), 404

                if user['tipo'] not in roles:
                    print(f"[DEBUG] Tipo '{user['tipo']}' no en roles requeridos: {roles}")
                    return jsonify({"error": "No autorizado"}), 403

                request.user = user
                return f(*args, **kwargs)

            except Exception as e:
                print(f"[ERROR AUTH] {e}")
                return jsonify({"error": "Error de autenticación"}), 401
        return wrapper
    return decorator
