<template>
    <div class="form-group" v-if="hayDisponibles">
      <label class="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Clock class="h-4 w-6" />
        Horarios disponibles*
      </label>
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
        <Button 
          v-for="horarioItem in horariosOrdenados"
          :key="horarioItem.hora"
          :variant="modelValue === horarioItem.hora ? 'default' : 'outline'"
          type="button"
          :class="cn(
            'text-sm transition-all duration-200',
            modelValue === horarioItem.hora
              ? 'bg-emerald-500 hover:bg-emerald-600 shadow-md'
              : 'hover:bg-emerald-50 hover:border-emerald-300'
          )"

          :disabled="!horarioItem.disponible"
          @click="$emit('update:modelValue', horarioItem.hora)"
        >
          {{ horarioItem.hora }}
        </Button>
      </div>
      <span class="text-sm text-red-500 mt-1" v-if="error">{{ error }}</span>
    </div>
    <p v-else class="text-sm text-red-500 italic mt-1">
      No hay horarios para la fecha seleccionada
    </p>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { Clock } from 'lucide-vue-next';
  import Button from '@/components/ui/button/Button.vue';
  import { cn } from '@/lib/utils';
  import type { HorarioDisponible } from '@/types/Veterinario';

  const props = defineProps<{
    modelValue: string
    horarios: HorarioDisponible[]
    error?: string
  }>()
  defineEmits(['update:modelValue'])

  function parseMinutes(hora: string): number {
    const [h, m] = hora.split(':').map(Number)
    return h * 60 + m
  }

  const horariosOrdenados = computed((): HorarioDisponible[] =>
    [...props.horarios].sort((a, b) => parseMinutes(a.hora) - parseMinutes(b.hora))
  )
  const hayDisponibles = computed(():boolean => props.horarios.some(h => h.disponible))

  </script>

  <style scoped>
    .form-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    }

    label {
    margin-bottom: 6px;
    }

    .horarios-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
    }

    .hora-btn {
    padding: 6px 12px;
    font-size: 14px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    }

    .hora-btn.disponible {
    background-color: #e0f7e9;
    }

    .hora-btn.seleccionado {
    background-color: #4caf50;
    color: white;
    }

    .hora-btn.deshabilitado {
    background-color: #f0f0f0;
    color: #aaa;
    cursor: not-allowed;
    }
  </style>