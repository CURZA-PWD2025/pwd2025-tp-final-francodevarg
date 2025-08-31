import { ref, computed, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { makeTurnoFormSchema } from '@/schemas/turnoFormSchema'
import { getLocalTimeZone } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import type { Veterinario } from '@/types/Veterinario'
import { useVeterinarioStore } from '@/store/useVeterinarioStore'

export function useTurnoForm() {
  const store = useVeterinarioStore()


  const horasValidas = computed(() =>
    store.horariosDisponibles.filter(h => h.disponible).map(h => h.hora)
  )

  // 2) Schema tipado y REACTIVO según las horas habilitadas
  const validationSchema = computed(() =>
    toTypedSchema(makeTurnoFormSchema(horasValidas.value))
  )

  // === VeeValidate ===
  const { validate, setFieldTouched } = useForm({
    validationSchema,
      validateOnMount: false,
      validateOnBlur: false,
      validateOnChange: false,
      validateOnInput: false,
      validateOnModelUpdate: false,
      initialValues: {
        veterinario_id: '',
        fecha: null as unknown as DateValue | null,
        hora: '' // string vacía => evita “Required”
      }
  })

  const { value: veterinario_id } = useField<string>('veterinario_id')
  const {
    value: fecha,
    errorMessage: fechaError,
    handleBlur: fechaBlur,
    meta: fechaMeta,
  } = useField<DateValue | undefined>('fecha')

  const {
    value: hora,
    errorMessage: horaError,
    meta: horaMeta,
  } = useField<string>('hora')

  // === Reset ===
  function resetCampos() {
    fecha.value = undefined
    hora.value = ""
    setFieldTouched('fecha', false)
    setFieldTouched('hora', false)
    store.clearHorarios()
  }

  // === Selección veterinario ===
  function onSeleccionarVeterinario(id: number | null) {
    console.log("id", id)
    if (!id) {
      veterinarioSelected.value = undefined
      store.veterinario = null
      resetCampos()
      return
    }
    veterinarioSelected.value = store.veterinarios.find(v => v.id === id)
    store.veterinario = (veterinarioSelected.value as Veterinario)
    resetCampos()
  }

  // === Días habilitados ===
  const diasMap: Record<string, number> = {
    Domingo: 0,
    Lunes: 1,
    Martes: 2,
    Miércoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
  }

  const diasHabilitados = computed(() =>
    Array.from(new Set(
      veterinarioSelected.value?.horarios.map(h => diasMap[h.dia_semana]) || []
    ))
  )

  // === Watch fecha → disponibilidad ===
  watch(fecha, async (nuevaFecha) => {
    if (!nuevaFecha || !veterinarioSelected.value) {
      resetCampos()
      return
    }

    const fechaISO = nuevaFecha.toDate(getLocalTimeZone()).toISOString().split('T')[0]
    await store.fetchDisponibilidad(veterinarioSelected.value.id, fechaISO)
  })

  // === Enviar ===
  async function validarYEnviarTurno() {
    const { valid } = await validate()
    if (!valid) {
      setFieldTouched('fecha', true)
      setFieldTouched('hora', true)
      return
    }
    store.horariosDisponibles = []
    return {
      veterinario_id: veterinario_id.value,
      fecha: fecha.value?.toString(),
      hora: hora.value?.toString(),
      estado: 'pendiente',
    }
  }

  return {
    store,
    veterinarioSelected,
    veterinario_id,
    fecha, fechaError, fechaMeta, fechaBlur,
    hora, horaError, horaMeta,
    diasHabilitados,
    onSeleccionarVeterinario,
    validarYEnviarTurno,
  }
}
