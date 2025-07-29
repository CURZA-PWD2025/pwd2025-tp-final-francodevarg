from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.modules.veterinario.veterinario_controller import VeterinarioController
from app.modules.horario.horario_controller import HorarioController

veterinario_bp = Blueprint("veterinario_bp", __name__, url_prefix="/veterinarios")

@veterinario_bp.route("/", methods=["GET"])
# @jwt_required()
def get_all():
    response, status = VeterinarioController.get_all()
    return jsonify(response), status

@jwt_required()
@veterinario_bp.route("/horarios-disponibles", methods=["GET"])
def get_horarios_disponibles():
    response, status = HorarioController.get_disponibilidad()
    return jsonify(response), status

@veterinario_bp.route("/<int:id>", methods=["GET"])
# @jwt_required()
def get_one(id):
    response, status = VeterinarioController.get_one(id)
    return jsonify(response), status

@veterinario_bp.route("/", methods=["POST"])
# @jwt_required()
def create():
    data = request.get_json()
    response, status = VeterinarioController.create(data)
    return jsonify(response), status

@veterinario_bp.route("/<int:id>", methods=["PUT"])
#@jwt_required()
def update(id):
    data = request.get_json()
    response, status = VeterinarioController.update(id, data)
    return jsonify(response), status

@veterinario_bp.route("/<int:id>", methods=["DELETE"])
#@jwt_required()
def delete(id):
    response, status = VeterinarioController.delete(id)
    return jsonify(response), status
