from flask import Blueprint, request, jsonify
from app.modules.turno.turno_controller import TurnoController
from app.middlewares.roles import role_required

turno_bp = Blueprint("turnos", __name__, url_prefix="/turnos")

@turno_bp.route("/", methods=["POST"])
@role_required('cliente')
def create():
    data = request.get_json(silent=True) or {}
    response, status = TurnoController.create(data)
    return jsonify(response), status

@turno_bp.route("/usuario/<int:user_id>", methods=["GET"])
@role_required('cliente')
def get_by_user(user_id):
    response, status = TurnoController.get_by_user(user_id)
    print(response)
    return jsonify(response), status