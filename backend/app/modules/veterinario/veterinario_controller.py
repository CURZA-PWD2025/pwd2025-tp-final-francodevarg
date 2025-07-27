from app.modules.veterinario.veterinario_model import VeterinarioModel
from app.modules.horario.horario_model import HorarioModel

class VeterinarioController:

    @staticmethod
    def get_all():
        rows = VeterinarioModel.get_all()
        return rows, 200 if rows else ({"mensaje": "No se encontraron veterinarios"}, 404)

    @staticmethod
    def get_one(id: int):
        row = VeterinarioModel.get_one(id)
        return (row, 200) if row else ({"mensaje": "Veterinario no encontrado"}, 404)

    @staticmethod
    def create(data: dict):
        try:
            info = data.get("veterinario", {})
            horarios = data.get("horarios", {})  # {"Lunes": ["08:00", "09:00"], ...}

            vet = VeterinarioModel(
                nombre=info["nombre"],
                especialidad=info["especialidad"],
                email=info["email"],
                telefono=info["telefono"]
            )

            vet_id = vet.create()
            if not vet_id:
                return {"mensaje": "Error al crear veterinario"}, 500

            HorarioModel.insert_bulk(vet_id, horarios)

            return {"mensaje": "Veterinario creado con horarios", "veterinario_id": vet_id}, 201

        except Exception as e:
            return {"mensaje": str(e)}, 500


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
