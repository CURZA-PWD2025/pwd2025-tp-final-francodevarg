from flask import Blueprint, request, jsonify
from app.middlewares.roles import role_required
from app.modules.mascota.mascota_controller import MascotaController

mascota_bp = Blueprint("mascota_bp", __name__, url_prefix="/mascotas")


@mascota_bp.route("/", methods=["GET"])
def get_all():
    response, status = MascotaController.get_all()
    return jsonify(response), status


@mascota_bp.route("/<int:id>", methods=["GET"])
@role_required("cliente")
def get_one(id):
    response, status = MascotaController.get_one(id)
    return jsonify(response), status


@mascota_bp.route("/", methods=["POST"])
@role_required("cliente")
def create():
    data = request.get_json()
    response, status = MascotaController.create(data)
    return jsonify(response), status


@mascota_bp.route("/<int:id>", methods=["PUT"])
@role_required("cliente")
def update(id):
    data = request.get_json()
    response, status = MascotaController.update(id, data)
    return jsonify(response), status


@mascota_bp.route("/<int:id>", methods=["DELETE"])
@role_required("cliente")
def delete(id):
    response, status = MascotaController.delete(id)
    return jsonify(response), status

@mascota_bp.route("/usuario/<int:usuario_id>", methods=["GET"])
@role_required("cliente")
def get_by_usuario(usuario_id):
    response, status = MascotaController.get_by_usuario(usuario_id)
    return jsonify(response), status
