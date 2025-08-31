<template>
    <div class="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-4">
      <div class="flex items-center gap-2 text-lg font-semibold">
        <Calendar class="h-5 w-5" />
        Paso 1: Seleccionar Cita
      </div>
      <p class="text-sm text-emerald-50 mt-1">
        Selecciona veterinario para tu mascota
      </p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Calendar } from 'lucide-vue-next'
  </script>
  