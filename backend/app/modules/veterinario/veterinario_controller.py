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
        # Validación mínima
        if not data or "veterinario" not in data:
            return {"mensaje": "Falta la clave 'veterinario'"}, 400

        v = data["veterinario"]
        campos = ["nombre", "especialidad", "email", "telefono"]
        for campo in campos:
            if campo not in v or not isinstance(v[campo], str) or not v[campo].strip():
                return {"mensaje": f"El campo '{campo}' es obligatorio"}, 400

        # Instanciar veterinario
        vet = VeterinarioModel(
            id=id,
            nombre=v["nombre"].strip(),
            especialidad=v["especialidad"].strip(),
            email=v["email"].strip(),
            telefono=v["telefono"].strip()
        )

        try:
            vet.update()
        except Exception as e:
            if "Duplicate entry" in str(e) and "'veterinarios.email'" in str(e):
                return {"mensaje": "El email ya está registrado por otro veterinario"},409
            return {"mensaje": str(e)},500

        # Actualizar horarios si vienen
        horarios = data.get("horarios")
        if horarios:
            #Borro los anteriores:
            HorarioModel.delete_by_veterinario_id(id)

            for dia, horas in horarios.items():
                for hora in horas:
                    horario = HorarioModel(
                        dia_semana=dia,
                        hora=hora,
                        veterinario_id=id
                    )
                    if horario.create() is None:
                        return {"mensaje": f"Error al insertar horario '{hora}' del día '{dia}'"}, 500

        return {"mensaje": "Veterinario actualizado correctamente"}, 200

    @staticmethod
    def delete(id: int):
        eliminado = VeterinarioModel(id).delete()
        if eliminado:
            return {"mensaje": "Veterinario eliminado"}, 200
        elif eliminado is False:
            return {"mensaje": "No se pudo eliminar"}, 400
        else:
            return {"mensaje": "Error interno"}, 500
