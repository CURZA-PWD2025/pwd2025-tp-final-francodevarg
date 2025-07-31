from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.modules.veterinario.veterinario_controller import VeterinarioController

veterinario_bp = Blueprint("veterinario_bp", __name__, url_prefix="/veterinarios")

@veterinario_bp.route("/", methods=["GET"])
# @jwt_required()
def get_all():
    response, status = VeterinarioController.get_all()
    return jsonify(response), status

@jwt_required()

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

@veterinario_bp.route("/disponibilidad", methods=["GET"])
def get_disponibilidad():
    veterinario_id = request.args.get("veterinario_id", type=int)
    fecha = request.args.get("fecha")

    if not veterinario_id or not fecha:
        return jsonify({"error": "veterinario_id y fecha son requeridos"}), 400
    
    try:
        return VeterinarioController.get_disponibilidad(veterinario_id, fecha)
    
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
