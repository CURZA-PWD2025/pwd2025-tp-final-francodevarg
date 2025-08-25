<template>
  <div>
    <HeaderCita />

    <form class="tarjeta-formulario">
      <div class="form-item">
        <VeterinarioSelect
          v-model="veterinario_id"
          @seleccionar="onSeleccionarVeterinario"
        />
      </div>

      <div v-if="veterinarioSelected" class="form-item">
        <DiasDisponibles
          :nombre="veterinarioSelected.nombre"
          :especialidad="veterinarioSelected.especialidad"
          :horarios="veterinarioSelected.horarios"
        />
      </div>

      <div v-if="veterinarioSelected" class="form-item">
        <DatePicker
          v-model="fecha"
          :dias-habilitados="diasHabilitados"
          :error="fechaMeta.touched ? fechaError : ''"
          @blur="fechaBlur"
        />
      </div>

      <div v-if="store.horariosDisponibles.length > 0" class="form-item">
        <HorarioSelector
          :horarios="store.horariosDisponibles"
          v-model="hora"
          :error="horaMeta.touched ? horaError : ''"
        />
      </div>

      <div class="form-item">
        <button
          type="button"
          class="boton-continuar"
          :class="{ 'activo': veterinario_id && fecha && hora }"
          @click="submit"
        >
          Continuar
        </button>

      </div>
    </form>

  </div>
</template>

<script setup lang="ts">
import { useTurnoForm } from '@/composables/useTurnoForm'
import {useTurnoStore} from "@/store/useTurnoStore"
import VeterinarioSelect from '@/components/turnos/VeterinarioSelect.vue'
import DiasDisponibles from '@/components/turnos/DiasDisponibles.vue'
import DatePicker from '@/components/DatePicker.vue'
import HorarioSelector from './HorarioSelector.vue'
import HeaderCita from './HeaderCita.vue'

const {
  store,
  veterinarioSelected,
  veterinario_id,
  fecha, fechaError, fechaMeta, fechaBlur,
  hora, horaError, horaMeta,
  diasHabilitados,
  onSeleccionarVeterinario,
  validarYEnviarTurno
} = useTurnoForm()

const emit = defineEmits(['next'])

const turnoStore = useTurnoStore();
async function submit() {
  const data = await validarYEnviarTurno()

  turnoStore.setTurnoDatos(data as any)
  console.log("data", data)

  if (data) {
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
  background-color: #e0e0e0; /* gris inactivo */
  color: #ffffff;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.boton-continuar.activo {
  background-color: #4caf50;
}

.boton-continuar:hover {
  opacity: 0.95;
}

</style>