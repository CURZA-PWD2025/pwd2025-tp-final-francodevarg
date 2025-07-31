<template>
    <div class="dias-container">
      <h3 class="nombre">{{ nombre }}</h3>
      <p class="especialidad">{{ especialidad }}</p>
      <div class="dias">
        <span
          v-for="dia in diasSemana"
          :key="dia.id"
          class="dia-chip"
          :class="{ activo: diasDisponibles.includes(dia.id) }"
        >
          {{ dia.label }}
        </span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
import { computed } from 'vue';

  const props = defineProps<{
    nombre: string
    especialidad: string
    horarios: { dia_semana: string; hora: string; id: number }[]
  }>()
  
  const diasSemana = [
    { id: 'Domingo', label: 'Dom' },
    { id: 'Lunes', label: 'Lun' },
    { id: 'Martes', label: 'Mar' },
    { id: 'Miércoles', label: 'Mié' },
    { id: 'Jueves', label: 'Jue' },
    { id: 'Viernes', label: 'Vie' },
    { id: 'Sábado', label: 'Sáb' },
  ]
  
  const diasDisponibles = computed(() => {
    const diasSet = new Set(props.horarios.map(h => h.dia_semana))
    return Array.from(diasSet)
  })
  </script>
  
  <style scoped>
  .dias-container {
    border: 1px solid #a7f3d0;
    background: linear-gradient(to right, #ecfdf5, #e0f7fa);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 24px;
  }
  
  .nombre {
    font-size: 1.2rem;
    font-weight: bold;
    color: #065f46;
    margin-bottom: 4px;
  }
  
  .especialidad {
    color: #047857;
    margin-bottom: 12px;
  }
  
  .dias {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  
  .dia-chip {
    padding: 6px 12px;
    border-radius: 9999px;
    background-color: #e5e7eb;
    font-size: 0.9rem;
    font-weight: 500;
    color: #374151;
  }
  
  .dia-chip.activo {
    background-color: #10b981;
    color: white;
  }
  </style>
  