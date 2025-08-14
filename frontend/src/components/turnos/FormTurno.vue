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
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

import VeterinarioSelect from '@/components/turnos/VeterinarioSelect.vue'
// import InputFecha from '@/components/turnos/InputFecha.vue'
// import HorarioSelector from '@/components/turnos/HorarioSelector.vue'
import DiasDisponibles from '@/components/turnos/DiasDisponibles.vue'

import { useVeterinarioStore } from '@/store/useVeterinarioStore'
import type { Veterinario } from '@/types/Veterinario'

const store = useVeterinarioStore()

const veterinarioSelected = ref<Veterinario>()

const schema = z.object({
  veterinario_id: z.string().min(1, 'Selecciona un veterinario'),
  fecha: z.string().min(1, 'La fecha es obligatoria'),
  hora: z.string().optional(),
})
const { value: veterinario_id } = useField<string>('veterinario_id')
const { value: fecha } = useField<string>('fecha')
const { value: hora } = useField<string>('hora')

const { validate, errors } = useForm({
  validationSchema: toTypedSchema(schema),
})




async function validarYEnviar() {
  const { valid } = await validate()
  if (!valid) return

  const data = {
    veterinario_id: veterinario_id.value,
    fecha: fecha.value,
    hora: hora.value, // opcional hoy
  }
}

function onSeleccionarVeterinario(id: number | null) {
  if (!id) {
    veterinario_id.value = ''
    return
  }
  veterinario_id.value = id.toString()

  veterinarioSelected.value  = store.veterinarios.find(v => v.id === id)
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

  