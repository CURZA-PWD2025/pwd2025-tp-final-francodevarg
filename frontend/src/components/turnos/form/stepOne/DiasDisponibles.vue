<template>
  <div class="dias-container">
    <div class="flex justify-items-end">
      <h3 class="nombre">
        {{ nombre }} - <span class="especialidad">{{ especialidad }}</span>
      </h3>
    </div>

    <h2 class="mb-2">Días de Atención:</h2>

    <ul class="dias flex gap-2">
      <li
        v-for="dia in diasSemanaConLabel"
        :key="dia.id"
        class="dia-chip"
        :class="{ activo: diasDisponibles.has(dia.id) }"
      >
        {{ dia.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { Horario } from '@/types/Veterinario'
  import { diasSemanaConLabel } from '@/constants/diasSemana'

  const props = defineProps<{
    nombre: string
    especialidad: string
    horarios: Horario[]
  }>()

  const diasDisponibles = computed(() => new Set(props.horarios.map(h => h.dia_semana)))
</script>
  
  <style scoped>
  .dias-container {
    border: 1px solid #a7f3d0;
    background: linear-gradient(to right, #ecfdf5, #e0f7fa);
    border-radius: 12px;
    padding: 16px;
    color:#047857;
  }
  
  .nombre {
    font-size: 1.2rem;
    font-weight: bold;
    color: #065f46;
    margin-bottom: 4px;
  }
  
  .especialidad {
    color: #047857;
    font-weight: 400;
    font-size: 1.2rem;
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
  