from app.modules.mascota.mascota_model import MascotaModel
from app.modules.usuario.usuario_model import UsuarioModel


class MascotaController:

    @staticmethod
    def get_all():
        try:
            mascotas = MascotaModel.get_all()
            return [m.serializar() for m in mascotas], 200
        except Exception as e:
            return {"error": str(e)}, 500

    @staticmethod
    def get_one(id: int):
        try:
            mascota = MascotaModel.get_one(id)
            if not mascota:
                return {"message": "Mascota no encontrada"}, 404
            return mascota, 200
        except Exception as e:
            return {"error": str(e)}, 500

    @staticmethod
    def create(data: dict):
        try:
            usuario = UsuarioModel.get_one(data["usuario_id"])
            if not usuario:
                return {"message": "Usuario no encontrado"}, 400

            mascota = MascotaModel(
                nombre=data["nombre"],
                especie=data["especie"],
                raza=data["raza"],
                edad=data["edad"],
                usuario=UsuarioModel.deserializar(usuario)
            )
            result = mascota.create()
            if result:
                print("result",result)
                return mascota.serializar(), 201
            return {"message": "Error al crear la mascota"}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    @staticmethod
    def update(id: int, data: dict):
        try:
            usuario = UsuarioModel.get_one(data["usuario_id"])
            if not usuario:
                return {"message": "Usuario no encontrado"}, 400

            mascota = MascotaModel(
                id=id,
                nombre=data["nombre"],
                especie=data["especie"],
                raza=data["raza"],
                edad=data["edad"],
                usuario=UsuarioModel.deserializar(usuario)
            )
            result = mascota.update()
            if result:
                return {"message": "Mascota actualizada correctamente"}, 200
            return {"message": "Error al actualizar la mascota"}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    @staticmethod
    def delete(id: int):
        try:
            mascota = MascotaModel(id=id)
            result = mascota.delete()
            if result:
                return {"message": "Mascota eliminada correctamente"}, 200
            return {"message": "Error al eliminar la mascota"}, 400
        except Exception as e:
            return {"error": str(e)}, 500

    @staticmethod
    def get_by_usuario(usuario_id: int):
        try:
            mascotas = MascotaModel.get_by_usuario_id(usuario_id)
            return [m.serializar() for m in mascotas], 200
        except Exception as e:
            return {"error": str(e)}, 500