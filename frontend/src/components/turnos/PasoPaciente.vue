<template>
  <div>
    <h3 class="text-lg font-semibold mb-4">Datos del Paciente</h3>
    <form class="space-y-4">
      <input v-model="nombre" type="text" placeholder="Nombre" class="border rounded p-2 w-full" />
      <input v-model="email" type="email" placeholder="Email" class="border rounded p-2 w-full" />
      <input v-model="telefono" type="text" placeholder="Teléfono" class="border rounded p-2 w-full" />
    </form>

    <div class="mt-6 flex justify-between">
      <button @click="$emit('prev')" class="px-4 py-2 bg-gray-200 rounded">Atrás</button>
      <button @click="submit" class="px-4 py-2 bg-green-600 text-white rounded">Siguiente</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTurnoStore } from '@/store/useTurnoStore'

const emit = defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()

const turnoStore = useTurnoStore()

const nombre = ref('')
const email = ref('')
const telefono = ref('')

function submit() {
  turnoStore.setPaciente({
    nombre: nombre.value,
    email: email.value,
    telefono: telefono.value,
  })
  emit('next')
}
</script>
