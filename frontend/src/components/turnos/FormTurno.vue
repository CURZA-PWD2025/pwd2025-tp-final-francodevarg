<template>
    <div class="px-6 py-6 space-y-6 bg-white">
      <VeterinarioSelect
        :veterinarios="veterinarios"
        @seleccionar="onSeleccionarVeterinario"
      />
  
      <VeterinarioDetalle
        v-if="veterinarioSeleccionado"
        :veterinario="veterinarioSeleccionado"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
  import veterinariosRaw from '@/data/veterinarios.json'
  import { normalizarHora } from '@/utils'
  import { formSchemaTurno } from '@/schemas/turnoSchema'
  import type { Veterinario } from '@/types/Veterinario'
  
  import VeterinarioSelect from './VeterinarioSelect.vue'
  import VeterinarioDetalle from './VeterinarioDetalle.vue'
  
  
  const veterinarios = ref<Veterinario[]>([])
  
  onMounted(() => {
    veterinarios.value = veterinariosRaw.map((vet) => ({
      ...vet,
      horarios: vet.horarios.map((h) => ({
        ...h,
        hora: normalizarHora(h.hora)
      }))
    }))
  })
  
  const { setFieldValue } = useForm({
    validationSchema: toTypedSchema(formSchemaTurno),
    initialValues: {
      veterinario_id: ''
    }
  })
  
  const veterinarioSeleccionado = ref<Veterinario | null>(null)
  
  function onSeleccionarVeterinario(id: string | null) {
    if (!id) {
      setFieldValue('veterinario_id', '')
      veterinarioSeleccionado.value = null
      return
    }
  
    setFieldValue('veterinario_id', id)
    veterinarioSeleccionado.value =
      veterinarios.value.find((v) => v.id.toString() === id) || null
  }
  </script>
  