<template>
    <form class="form-container">
      <SelectVeterinario
        :veterinarios="veterinarios"
        v-model="veterinario_id"
        :error="errors.veterinario_id"
      />
  
      <DiasDisponibles
        v-if="veterinarioSeleccionado"
        :nombre="veterinarioSeleccionado.nombre"
        :especialidad="veterinarioSeleccionado.especialidad"
        :horarios="veterinarioSeleccionado.horarios"
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
  
  import SelectVeterinario from '@/components/turnos/SelectVeterinario.vue'
  import InputFecha from '@/components/turnos/InputFecha.vue'
  import HorarioSelector from '@/components/turnos/HorarioSelector.vue'
  import DiasDisponibles from '@/components/turnos/DiasDisponibles.vue'
  
  // Veterinarios simulados con horarios por día
  const veterinarios = [
    {
      id: 1,
      nombre: 'Dra. Ana Fernández',
      especialidad: 'Cardiología',
      horarios: [
        { dia_semana: 'Lunes', hora: '09:00:00', id: 1 },
        { dia_semana: 'Lunes', hora: '10:00:00', id: 2 },
        { dia_semana: 'Miércoles', hora: '11:00:00', id: 3 },
      ],
    },
    {
      id: 2,
      nombre: 'Dr. Luis Martínez',
      especialidad: 'Dermatología',
      horarios: [
        { dia_semana: 'Martes', hora: '09:00:00', id: 4 },
        { dia_semana: 'Jueves', hora: '10:00:00', id: 5 },
        { dia_semana: 'Sábado', hora: '11:00:00', id: 6 },
      ],
    },
    {
      id: 3,
      nombre: 'Dra. Sofía Gómez',
      especialidad: 'Medicina general',
      horarios: [
        { dia_semana: 'Lunes', hora: '09:00:00', id: 7 },
        { dia_semana: 'Martes', hora: '11:00:00', id: 8 },
        { dia_semana: 'Viernes', hora: '10:00:00', id: 9 },
      ],
    },
  ]
  
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
  
  function simularHorarios(vetId: string, fechaVal: string) {
    const todasLasHoras = [
      { hora: '09:00', disponible: Math.random() > 0.5 },
      { hora: '10:00', disponible: Math.random() > 0.5 },
      { hora: '11:00', disponible: Math.random() > 0.5 },
      { hora: '12:00', disponible: Math.random() > 0.5 },
      { hora: '14:00', disponible: Math.random() > 0.5 },
      { hora: '15:00', disponible: Math.random() > 0.5 },
      { hora: '16:00', disponible: Math.random() > 0.5 },
    ]
  
    setTimeout(() => {
      horarios.value = todasLasHoras
      hora.value = ''
    }, 300)
  }
  
  watch([veterinario_id, fecha], ([vetId, f]) => {
    if (vetId && f) {
      simularHorarios(vetId, f)
    } else {
      horarios.value = []
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
  