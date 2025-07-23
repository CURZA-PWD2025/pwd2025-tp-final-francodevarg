from flask import Blueprint, request, jsonify

usuario_bp = Blueprint("usuarios", __name__)

# Obtener todos los artículos
@usuario_bp.route("/usuarios/", methods=["GET"])
def get_all_usuarios():
    try:
        usuarios = [{"id": 1, "nombre": "Juan Perez", "email": ""}]
        return jsonify(usuarios), 200
    except Exception as exc:
        return jsonify({'mensaje': f"Error: {str(exc)}"}), 500
