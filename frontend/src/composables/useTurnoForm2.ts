import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { makeTurnoFormSchema } from '@/schemas/turnoFormSchema'
import type { DateValue } from '@internationalized/date'
import type { Turno } from '@/types/Turno'


// Gestiona y valida los campos del formulario de turno,
// y si son válidos, guarda los datos tipados en el store (useTurnoStore).

export function useTurnoForm2() {

  const { validate, validateField, setFieldTouched, resetForm } = useForm({
    validationSchema: toTypedSchema(makeTurnoFormSchema()),
    validateOnMount: false,
    initialValues: {
      veterinario_id: '',
      mascota_id: '',
      fecha: null as unknown as DateValue | null,
      hora: '',
      motivo: '',
      estado: 'pendiente'
    }
  })

  // === Campos ===
  const {
    value: veterinario_id,
    errorMessage: veterinarioIdError,
    meta: veterinarioIdMeta
  } = useField<string>('veterinario_id')

  const {
    value: mascota_id,
    errorMessage: mascotaIdError,
    meta: mascotaIdMeta
  } = useField<string>('mascota_id')

  const {
    value: fecha,
    errorMessage: fechaError,
    handleBlur: fechaBlur,
    meta: fechaMeta
  } = useField<DateValue | undefined>('fecha')

  const {
    value: hora,
    errorMessage: horaError,
    meta: horaMeta
  } = useField<string>('hora')

  const {
    value: motivo,
    errorMessage: motivoError,
    meta: motivoMeta
  } = useField<string>('motivo')

  const {
    value: estado,
    errorMessage: estadoError,
    meta: estadoMeta
  } = useField<string>('estado')

  // === Reset ===
  function resetCampos() {
    resetForm({
      values: {
        veterinario_id: '',
        mascota_id: '',
        fecha: undefined,
        hora: '',
        motivo: '',
        estado: 'pendiente'
      },
      touched: {
        veterinario_id: false,
        mascota_id: false,
        fecha: false,
        hora: false,
        motivo: false,
        estado: false
      }
    })
  }

  async function validarPaso1(): Promise<boolean> {
    const [vId, f, h] = await Promise.all([
      validateField('veterinario_id'),
      validateField('fecha'),
      validateField('hora'),
    ])
    const ok = vId.valid && f.valid && h.valid
    if (!ok) {
      setFieldTouched('veterinario_id', true)
      setFieldTouched('fecha', true)
      setFieldTouched('hora', true)
    }
    return ok
  }

  async function validarYEnviarTurnoPaso1(): Promise<Partial<Turno> | null> {
    const ok = await validarPaso1()
    if (!ok) return null

    const payload: Partial<Turno> = {
      veterinario_id: Number(veterinario_id.value) || null,
      fecha: fecha.value?.toString() ?? '',
      hora: hora.value,
      estado: estado.value as Turno['estado'],
    }
    return payload
  }

  // === Enviar ===
  async function validarYEnviarTurno(): Promise<Turno | null> {
    const { valid } = await validate()
    console.log("valid",valid)
    if (!valid) {
      setFieldTouched('veterinario_id', true)
      setFieldTouched('mascota_id', true)
      setFieldTouched('fecha', true)
      setFieldTouched('hora', true)
      setFieldTouched('motivo', true)
      setFieldTouched('estado', true)
      return null
    }

    const payload: Turno = {
      veterinario_id: Number(veterinario_id.value) || null,
      mascota_id: Number(mascota_id.value) || null,
      fecha: fecha.value?.toString() ?? '',
      hora: hora.value,
      motivo: motivo.value,
      estado: estado.value as Turno['estado']
    }
    return payload
  }

  return {
    veterinario_id, veterinarioIdError, veterinarioIdMeta,
    mascota_id, mascotaIdError, mascotaIdMeta,
    fecha, fechaError, fechaMeta, fechaBlur,
    hora, horaError, horaMeta,
    motivo, motivoError, motivoMeta,
    estado, estadoError, estadoMeta,
    resetCampos,
    validarYEnviarTurno,
    validarPaso1,
    validarYEnviarTurnoPaso1
  }
}
