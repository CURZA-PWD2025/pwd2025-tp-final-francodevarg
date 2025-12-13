import { reactive, ref } from 'vue'
import { useMascotaStore } from '@/store/useMascotaStore'
import type { Mascota } from '@/types/Mascota'

export function useMascotaForm() {
    const mascotaStore = useMascotaStore()

    const newMascota = reactive({
        nombre: '',
        especie: '',
        raza: '',
        edad: 1
    })

    const errors = reactive({
        nombre: '',
        especie: '',
        raza: '',
        edad: ''
    })

    const isSubmitting = ref(false)

    function validateNewMascota() {
        let isValid = true
        errors.nombre = ''
        errors.especie = ''
        errors.raza = ''
        errors.edad = ''

        if (!newMascota.nombre) {
            errors.nombre = 'El nombre es requerido'
            isValid = false
        }
        if (!newMascota.especie) {
            errors.especie = 'La especie es requerida'
            isValid = false
        }
        if (!newMascota.raza) {
            errors.raza = 'La raza es requerida'
            isValid = false
        }
        if (newMascota.edad === undefined || newMascota.edad === null || newMascota.edad < 0) {
            errors.edad = 'Edad incorrecta'
            isValid = false
        }

        return isValid
    }

    async function crearMascota(userId: number): Promise<Mascota | null> {
        if (!validateNewMascota()) return null

        isSubmitting.value = true
        try {
            const created = await mascotaStore.createOne({
                ...newMascota,
                usuario_id: userId
            })
            return created as Mascota
        } catch (e) {
            console.error("Error creando mascota", e)
            alert("Hubo un error al registrar la mascota. Intenta nuevamente.")
            return null
        } finally {
            isSubmitting.value = false
        }
    }

    return {
        newMascota,
        errors,
        isSubmitting,
        crearMascota
    }
}
