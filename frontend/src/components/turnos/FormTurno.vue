<template>
    <form class="form-container">
      <VeterinarioSelect
        v-model="veterinario_id"
        @seleccionar="onSeleccionarVeterinario"
      />

      <DiasDisponibles
        v-if="store.veterinario"
        :nombre="store.veterinario.nombre"
        :especialidad="store.veterinario.especialidad"
        :horarios="store.veterinario.horarios"
      />
  
      <InputFecha v-model="fecha" :error="errors.fecha" />
  
      <HorarioSelector
        :horarios="horarios"
        v-model="hora"
        :error="errors.hora"
      />
  
      <button type="button" class="submit-btn" @click="validarYEnviar">Agendar turno</button>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { useForm, useField } from 'vee-validate'
  import { z } from 'zod'
  import { toTypedSchema } from '@vee-validate/zod'
  
  import VeterinarioSelect from '@/components/turnos/VeterinarioSelect.vue'
  import InputFecha from '@/components/turnos/InputFecha.vue'
  import HorarioSelector from '@/components/turnos/HorarioSelector.vue'
  import DiasDisponibles from '@/components/turnos/DiasDisponibles.vue'
  

  import { useVeterinarioStore } from '@/store/useVeterinarioStore'

  const store = useVeterinarioStore()

  const veterinarios = store.veterinarios
  const horarios = ref<{ hora: string; disponible: boolean }[]>([])
  
  const schema = z.object({
    veterinario_id: z.string().min(1, 'Selecciona un veterinario'),
    fecha: z.string().min(1, 'La fecha es obligatoria'),
    hora: z.string().min(1, 'Selecciona una hora'),
  })
  
  const { validate, errors } = useForm({
    validationSchema: toTypedSchema(schema),
  })
  
  const { value: veterinario_id } = useField<string>('veterinario_id')
  const { value: fecha } = useField<string>('fecha')
  const { value: hora } = useField<string>('hora')
  
  const veterinarioSeleccionado = computed(() =>
    veterinarios.find(v => v.id.toString() === veterinario_id.value)
  )
  
  // function simularHorarios(vetId: string, fechaVal: string) {
  //   const todasLasHoras = [
  //     { hora: '09:00', disponible: Math.random() > 0.5 },
  //     { hora: '10:00', disponible: Math.random() > 0.5 },
  //     { hora: '11:00', disponible: Math.random() > 0.5 },
  //     { hora: '12:00', disponible: Math.random() > 0.5 },
  //     { hora: '14:00', disponible: Math.random() > 0.5 },
  //     { hora: '15:00', disponible: Math.random() > 0.5 },
  //     { hora: '16:00', disponible: Math.random() > 0.5 },
  //   ]
  
  //   setTimeout(() => {
  //     horarios.value = todasLasHoras
  //     hora.value = ''
  //   }, 300)
  // }
  
  watch([veterinario_id, fecha], ([vetId, f]) => {
    if (vetId) {
      store.fetchHorarios(vetId)
    } else {
      store.clearHorarios()
    }
  })
  
  async function validarYEnviar() {
    const { valid } = await validate()
    if (valid) {
      const data = {
        veterinario_id: veterinario_id.value,
        fecha: fecha.value,
        hora: hora.value,
      }
      onSubmit(data)
    }
  }
  
  function onSubmit(data: any) {
    console.log('Turno agendado:', data)
  }
  function onSeleccionarVeterinario(id: number | null) {
    console.log('Veterinario seleccionado ID:', id)
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
  