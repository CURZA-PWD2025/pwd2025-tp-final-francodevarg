from flask import Blueprint, request, jsonify
from .auth_controller import AuthController

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

@auth_bp.route("/profile", methods=["GET"])
def profile():
    response, status = AuthController.profile()
    return jsonify(response), status
