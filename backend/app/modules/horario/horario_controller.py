from flask import request, jsonify
from .horario_model import HorarioModel

class HorarioController:
    @staticmethod
    def get_disponibilidad():
        veterinario_id = request.args.get("veterinario_id", type=int)
        fecha = request.args.get("fecha")  # formato 'YYYY-MM-DD'

        if not veterinario_id or not fecha:
            return jsonify({"error": "veterinario_id y fecha son requeridos"}), 400

        try:
            horarios = HorarioModel.get_disponibilidad_por_fecha(veterinario_id, fecha)
        except ValueError as e:
            return jsonify({"error": str(e)}), 400

        return {
            "veterinario_id": veterinario_id,
            "fecha": fecha,
            "horarios": horarios
        },200
