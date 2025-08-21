<template>
  <div>
    <HeaderConfirmacion />

    <div class="space-y-2">
      <p><strong>Veterinario ID:</strong> {{ turno.veterinario_id }}</p>
      <p><strong>Fecha:</strong> {{ turno.fecha }}</p>
      <p><strong>Hora:</strong> {{ turno.hora }}</p>
    </div>

    <div class="mt-6 flex justify-between">
      <button @click="$emit('prev')" class="px-4 py-2 bg-gray-200 rounded">Atrás</button>
      <button @click="$emit('finish')" class="px-4 py-2 bg-blue-600 text-white rounded">Confirmar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTurnoStore } from '@/store/useTurnoStore'
import HeaderConfirmacion from './HeaderConfirmacion.vue';
const turnoStore = useTurnoStore()
const turno = turnoStore.turno
</script>
