from app.modules.turno.turno_model import TurnoModel
from app.modules.turno.turno_model import TurnoModel
from app.modules.veterinario.veterinario_model import VeterinarioModel
from app.modules.mascota.mascota_model import MascotaModel

def _hhmm_to_hhmmss(hora: str) -> str:
        if not hora:
            return hora
        parts = hora.split(":")
        if len(parts) == 2:
            return f"{parts[0].zfill(2)}:{parts[1].zfill(2)}:00"
        return hora


class TurnoController:

    @staticmethod
    def create(data: dict):
        if not isinstance(data, dict):
            return {"mensaje": "Cuerpo inválido"}, 400

        requeridos = ["fecha", "hora", "mascota_id", "veterinario_id"]
        for campo in requeridos:
            if campo not in data or not str(data[campo]).strip():
                return {"mensaje": f"Falta el campo '{campo}'"}, 400

        fecha = str(data["fecha"]).strip()
        hora = _hhmm_to_hhmmss(str(data["hora"]).strip())
        estado = (data.get("estado") or "pendiente").strip().lower()
        motivo = str(data.get("motivo") or "")

        try:
            veterinario_id = int(data["veterinario_id"])
            mascota_id = int(data["mascota_id"])
        except ValueError:
            return {"mensaje": "IDs inválidos"}, 400

        vet_row = VeterinarioModel.get_one(veterinario_id)
        if not vet_row:
            return {"mensaje": "Veterinario no encontrado"}, 404
        veterinario = VeterinarioModel.deserializar(vet_row)

        mas_row = MascotaModel.get_one(mascota_id)
        if not mas_row:
            return {"mensaje": "Mascota no encontrada"}, 404
        mascota = MascotaModel.deserializar(mas_row) if hasattr(MascotaModel, "deserializar") else MascotaModel(id=mas_row["id"])

        turno = TurnoModel(
            mascota=mascota,
            veterinario=veterinario,
            fecha=fecha,
            hora=hora,
            estado=estado,
            motivo=motivo
        )

        inserted_id = turno.create()
        if not inserted_id:
            return {"mensaje": "Error al crear el turno"}, 500

        turno.id = inserted_id
        return {"mensaje": "Turno creado correctamente", "turno": turno.serializar()}, 201


    @staticmethod
    def get_by_user(user_id: int):
        try:
            turnos = TurnoModel.get_by_user(user_id)
            return turnos, 200
        except Exception as e:
            return {"error": str(e)}, 400