from app.modules.veterinario.veterinario_model import VeterinarioModel
from app.modules.horario.horario_model import HorarioModel

class VeterinarioController:

    @staticmethod
    def get_all():
        veterinarios = VeterinarioModel.get_all()
        return [v.serializar() for v in veterinarios], 200
    
    @staticmethod
    def get_one(id: int):
        row = VeterinarioModel.get_one(id)
        return (row, 200) if row else ({"mensaje": "Veterinario no encontrado"}, 404)

    @staticmethod
    def get_disponibilidad(veterinario_id: int , fecha: str):
        row = HorarioModel.get_disponibilidad_por_fecha(veterinario_id, fecha)
        return (row, 200) if row else ({"mensaje": "Disponibilidad no encontrado"}, 404)
    
    @staticmethod
    def create(data: dict):
        if not isinstance(data, dict) or "veterinario" not in data:
            return {"mensaje": "Falta la clave 'veterinario' en el cuerpo de la solicitud"}, 400

        v = data["veterinario"]

        # Validar Campos de Veterinario
        campos_requeridos = ["nombre", "especialidad", "email", "telefono"]
        for campo in campos_requeridos:
            if campo not in v or not v[campo]:
                return {"mensaje": f"Falta el campo obligatorio '{campo}' en 'veterinario'"}, 400

        #Validar Horarios
        if "horarios" not in data:
            return {"mensaje": "Falta la clave 'horarios' en el cuerpo de la solicitud"}, 400
        
        if not data["horarios"].items():
            return {"mensaje": "Debes proporcionar al menos un día con horarios"}, 400

        v = data["veterinario"]

        vet = VeterinarioModel(
            nombre=v["nombre"],
            especialidad=v["especialidad"],
            email=v["email"],
            telefono=v["telefono"]
        )

        result = vet.create()

        if not result:
            return {"mensaje": "Error al insertar veterinario"}, 400

        horarios = data.get("horarios", {})
        for dia, horas in horarios.items():
            for hora in horas:
                horario = HorarioModel(
                    dia_semana=dia,
                    hora=hora,
                    veterinario_id=result
                )
                horario_result = horario.create()
                if horario_result is None:
                    return {"mensaje": "Error al insertar horario"}, 500

        return {"mensaje": "Veterinario creado correctamente"}, 200


    @staticmethod
    def update(id: int, data: dict):
        try:
            vet = VeterinarioModel(
                id=id,
                nombre=data.get("nombre"),
                especialidad=data.get("especialidad"),
                email=data.get("email"),
                telefono=data.get("telefono")
            )
            if vet.update():
                return {"mensaje": "Veterinario actualizado"}, 200
            return {"mensaje": "No se pudo actualizar"}, 400
        except Exception as e:
            return {"mensaje": str(e)}, 500

    @staticmethod
    def delete(id: int):
        eliminado = VeterinarioModel.delete(id)
        if eliminado:
            return {"mensaje": "Veterinario eliminado"}, 200
        elif eliminado is False:
            return {"mensaje": "No se pudo eliminar"}, 400
        else:
            return {"mensaje": "Error interno"}, 500
