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
      :dias-habilitados="diasHabilitados"
      v-model="fecha"
    />
    <!-- <InputFecha v-model="fecha" :error="errors.fecha" /> -->

    <!-- Si volvés a usar HorarioSelector, descomenta esto y cambia el schema de 'hora' -->
    <!--
    <HorarioSelector
      :horarios="horarios"
      v-model="hora"
      :error="errors.hora"
    />
    -->

    <button type="button" class="submit-btn" @click="validarYEnviar">
      Agendar turno
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
  type DateValue,
} from '@internationalized/date'
import VeterinarioSelect from '@/components/turnos/VeterinarioSelect.vue'
import DiasDisponibles from '@/components/turnos/DiasDisponibles.vue'
import { useVeterinarioStore } from '@/store/useVeterinarioStore'
import type { Veterinario } from '@/types/Veterinario'
import { turnoFormSchema } from '@/schemas/turnoFormSchema'
import DatePicker from '../DatePicker.vue'

const store = useVeterinarioStore()

const veterinarioSelected = ref<Veterinario>()
const { value: veterinario_id } = useField<string>('veterinario_id')
const { value: fecha } = useField<DateValue | undefined >('fecha')
const { value: hora } = useField<string>('hora')

const { validate, errors } = useForm({
  validationSchema: toTypedSchema(turnoFormSchema),
})

async function validarYEnviar() {
  const { valid } = await validate()
  if (!valid) return

  const data = {
    veterinario_id: veterinario_id.value,
    fecha: fecha.value?.toString(),
    hora: hora.value,
  }
  console.log('Datos del turno:', data)
}

function onSeleccionarVeterinario(id: number | null) {
  if (!id) {
    veterinarioSelected.value = undefined
    fecha.value = undefined 
    return
  }

  veterinarioSelected.value = store.veterinarios.find(v => v.id === id)
  fecha.value = undefined
}

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

  