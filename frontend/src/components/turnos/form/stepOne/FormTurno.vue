<template>
  <div>
    <HeaderCita />

    <form class="tarjeta-formulario">
      <!-- Veterinario -->
      <div class="form-item">
        <VeterinarioSelect
          v-model="veterinario_id"
          @seleccionar="onSeleccionarVeterinario"
        />
      </div>

      <!-- Detalle del veterinario seleccionado -->
      <div v-if="turnoStore.veterinario" class="form-item">
        <DiasDisponibles
          :nombre="turnoStore.veterinario.nombre"
          :especialidad="turnoStore.veterinario.especialidad"
          :horarios="turnoStore.veterinario.horarios"
        />
      </div>

      <!-- Fecha -->
      <div v-if="turnoStore.veterinario" class="form-item">
        <DatePicker
          v-model="fecha"
          :dias-habilitados="turnoStore.diasHabilitados"
          :error="fechaMeta.touched ? fechaError : ''"
          @blur="fechaBlur"
        />
        <small class="text-xs text-gray-500">
          Solo se muestran las fechas en las que {{ turnoStore.veterinario.nombre }} atiende
        </small>
      </div>

      <!-- Hora -->
      <div v-if="turnoStore.horariosDisponibles.length > 0" class="form-item">
        <HorarioSelector
          :horarios="turnoStore.horariosDisponibles"
          v-model="hora"
          :error="horaMeta.touched ? horaError : ''"
        />
      </div>

      <!-- Botón -->
      <div class="form-item">
        <button
          type="button"
          class="boton-continuar"
          @click="submit"
        >
          Continuar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import HeaderCita from './HeaderCita.vue'
import VeterinarioSelect from './VeterinarioSelect.vue'
import DiasDisponibles from './DiasDisponibles.vue'
import DatePicker from '@/components/DatePicker.vue'
import HorarioSelector from './HorarioSelector.vue'

import { watch } from 'vue'
import { getLocalTimeZone, parseDate } from '@internationalized/date'
import { useTurnoForm } from '@/composables/useTurnoForm'
import { useTurnoStore } from '@/store/useTurnoStore'

const emit = defineEmits(['next'])

// Composables
const turnoStore = useTurnoStore()
const {
  veterinario_id,
  fecha, fechaError, fechaMeta, fechaBlur,
  hora, horaError, horaMeta,
  validarYEnviarTurnoPaso1
} = useTurnoForm({
  veterinario_id: turnoStore.turno.veterinario_id,
  fecha: turnoStore.turno.fecha ? parseDate(turnoStore.turno.fecha) : undefined,
  hora: turnoStore.turno.hora ?? '',
})

// Selección de veterinario
function onSeleccionarVeterinario(id: number | null) {
  turnoStore.veterinario = id
    ? turnoStore.veterinarios.find(v => v.id === id) || null
    : null

  turnoStore.clearHorarios()
}

watch(fecha, async (nuevaFecha) => {
  if (!nuevaFecha || !turnoStore.veterinario?.id) return
  const fechaISO = nuevaFecha.toDate(getLocalTimeZone()).toISOString().split('T')[0]
  await turnoStore.fetchDisponibilidad(turnoStore.veterinario.id, fechaISO)
})
// === Submit ===
async function submit() {
  const data = await validarYEnviarTurnoPaso1()
  console.log("data",data)

  if (data) {
    turnoStore.setTurnoDatos(data)
    emit('next')
  } else {
    fechaMeta.touched = true
    horaMeta.touched = true
  }
}
</script>

<style scoped>
.tarjeta-formulario {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 24px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.05);
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.boton-continuar {
  width: 100%;
  background-color: #4caf50;
  color: #ffffff;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
</style>
