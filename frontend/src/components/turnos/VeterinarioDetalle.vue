<template>
    <div class="p-4 rounded-lg border bg-green-50">
      <h3 class="font-semibold text-base">
        {{ veterinario.nombre }}
      </h3>
      <p class="text-sm text-muted-foreground mb-3">
        {{ veterinario.especialidad }} · {{ veterinario.email }}
      </p>
      <div class="flex gap-2 flex-wrap">
        <span
          v-for="dia in diasSemana"
          :key="dia"
          :class="[
            'text-xs px-3 py-1 rounded-full border',
            tieneDiaLaboral(dia)
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-500'
          ]"
        >
          {{ dia }}
        </span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { Veterinario } from '@/types/Veterinario'
  import { diasSemana } from '@/constants/diasSemana';
  
  const props = defineProps<{
    veterinario: Veterinario
  }>()
  
  function tieneDiaLaboral(dia: string): boolean {
    return props.veterinario.horarios.some(h => h.dia_semana === dia)
  }
  </script>
  