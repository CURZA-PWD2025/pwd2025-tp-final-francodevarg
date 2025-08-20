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

    <button type="button" class="submit-btn" @click="submit">
      Agendar turno
    </button>
  </form>
</template>

<script setup lang="ts">
import { useTurnoForm } from '@/composables/useTurnoForm'
import VeterinarioSelect from '@/components/turnos/VeterinarioSelect.vue'
import DiasDisponibles from '@/components/turnos/DiasDisponibles.vue'
import DatePicker from '@/components/DatePicker.vue'
import HorarioSelector from './HorarioSelector.vue'

const {
  store,
  veterinarioSelected,
  veterinario_id,
  fecha, fechaError, fechaMeta, fechaBlur,
  hora, horaError, horaMeta,
  diasHabilitados,
  onSeleccionarVeterinario,
  validarYEnviar
} = useTurnoForm()

const emit = defineEmits(['next'])

async function submit() {
  const data = await validarYEnviar()
  if (data) {
    console.log('Datos del turno:', data)
    emit('next')
  }
}
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
