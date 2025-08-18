<template>
  <form class="form-container">
    <VeterinarioSelect
      v-model="veterinario_id"
      @seleccionar="onSeleccionarVeterinario"
    />

    <DiasDisponibles
      v-if="veterinarioSelected"
      :nombre="veterinarioSelected.nombre"
      :especialidad="veterinarioSelected.especialidad"
      :horarios="veterinarioSelected.horarios"
    />

    <DatePicker
      v-if="veterinarioSelected"
      v-model="fecha"
      :dias-habilitados="diasHabilitados"
      :error="fechaMeta.touched ? fechaError : ''"
      @blur="fechaBlur"
    />
    <HorarioSelector
      v-if="store.horariosDisponibles.length > 0"
      :horarios="store.horariosDisponibles"
      v-model="hora"
      :error="horaMeta.touched ? horaError : ''"
    />


    <button type="button" class="submit-btn" @click="validarYEnviar">
      Agendar turno
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { turnoFormSchema } from '@/schemas/turnoFormSchema'
import type { Veterinario } from '@/types/Veterinario'
import type { DateValue } from '@internationalized/date'

import { useVeterinarioStore } from '@/store/useVeterinarioStore'
import VeterinarioSelect from '@/components/turnos/VeterinarioSelect.vue'
import DiasDisponibles from '@/components/turnos/DiasDisponibles.vue'
import DatePicker from '@/components/DatePicker.vue'
import HorarioSelector from './HorarioSelector.vue'
import { getLocalTimeZone } from '@internationalized/date'
import { watch } from 'vue'

const store = useVeterinarioStore()
const veterinarioSelected = ref<Veterinario>()

// === VeeValidate ===
const { validate, setFieldTouched } = useForm({
  validationSchema: toTypedSchema(turnoFormSchema),
  validateOnMount: false,
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
} = useField<string | undefined>('hora')



// === Envío del formulario ===
async function validarYEnviar() {
  const { valid } = await validate()
  console.log('Validación:', valid)

  if (!valid) {
    setFieldTouched('fecha', true)
    setFieldTouched('hora', true)
    return
  }

  const data = {
    veterinario_id: veterinario_id.value,
    fecha: fecha.value?.toString(),
    hora: hora.value?.toString(),
    estado: 'pendiente',
  } 

  console.log('Datos del turno:', data)
}

// === Al seleccionar veterinario ===
function onSeleccionarVeterinario(id: number | null) {
  if (!id) {
    veterinarioSelected.value = undefined
    fecha.value = undefined
    hora.value = undefined
    store.clearHorarios()
    setFieldTouched('fecha', false)
    setFieldTouched('hora', false)
    return
  }

  veterinarioSelected.value = store.veterinarios.find(v => v.id === id)
  fecha.value = undefined
  hora.value = undefined
  setFieldTouched('hora', false)
  setFieldTouched('fecha', false)
}


// === Cálculo de días hábiles ===
const diasMap: Record<string, number> = {
  'Domingo': 0,
  'Lunes': 1,
  'Martes': 2,
  'Miércoles': 3,
  'Jueves': 4,
  'Viernes': 5,
  'Sábado': 6,
}

const diasHabilitados = computed(() =>
  Array.from(new Set(
    veterinarioSelected.value?.horarios.map(h => diasMap[h.dia_semana]) || []
  ))
)


watch(fecha, async (nuevaFecha) => {
  console.log('Fecha seleccionada:', nuevaFecha)
  if (!nuevaFecha || !veterinarioSelected.value) {
    store.clearHorarios()
    setFieldTouched('hora', false)
    return
  }

  const fechaISO = nuevaFecha.toDate(getLocalTimeZone()).toISOString().split('T')[0]
  await store.fetchDisponibilidad(veterinarioSelected.value.id, fechaISO)
})



</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fafafa;
}

.submit-btn {
  background-color: #4caf50;
  color: white;
  padding: 10px 16px;
  font-size: 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
