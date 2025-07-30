<template>
  <div class="px-6 py-6 space-y-6 bg-white">
    <VeterinarioSelect @seleccionar="onSeleccionarVeterinario" />

    <VeterinarioDetalle
      v-if="veterinarioSeleccionado"
      :veterinario="veterinarioSeleccionado"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { formSchemaTurno } from '@/schemas/turnoSchema'
import type { Veterinario } from '@/types/Veterinario'

import VeterinarioSelect from './VeterinarioSelect.vue'
import VeterinarioDetalle from './VeterinarioDetalle.vue'
import { useVeterinarioStore } from '@/store/useVeterinarioStore'

const store = useVeterinarioStore()

const { setFieldValue } = useForm({
  validationSchema: toTypedSchema(formSchemaTurno),
  initialValues: {
    veterinario_id: ''
  }
})

const veterinarioSeleccionado = ref<Veterinario | null>(null)

function onSeleccionarVeterinario(id: number | null) {
  setFieldValue('veterinario_id', id?.toString() ?? '')
  veterinarioSeleccionado.value =
    store.veterinarios.find((v) => v.id === id) ?? null
}
</script>


