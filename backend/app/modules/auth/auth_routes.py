from flask import Blueprint, request, jsonify
from .auth_controller import AuthController
from app.middlewares.roles import role_required

auth_bp = Blueprint("auth_bp", __name__, url_prefix="/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    response, status = AuthController.register(data)
    return jsonify(response), status

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    result,status = AuthController.login(data)
    return jsonify(result), status

@auth_bp.route("/profile/<int:user_id>", methods=["GET"])
@role_required('admin', 'cliente')
def profile(user_id: int):
    response, status = AuthController.profile(user_id)
    return jsonify(response), status

@auth_bp.route("/logout/", methods=["POST"])
@role_required('admin', 'cliente')
def logout():
    response, status = AuthController.logout()
    return jsonify(response), status
