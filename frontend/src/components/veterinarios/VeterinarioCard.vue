<template>
  <div class="bg-white rounded-xl shadow-sm border border-border p-6 space-y-3">
    <div class="flex items-start justify-between">
      <div>
        <h4 class="font-bold text-lg flex items-center gap-2">
          <UsersIcon class="w-5 h-5" />
          {{ veterinario.nombre }}
        </h4>
        <p class="text-sm text-muted-foreground">
          {{ veterinario.especialidad }} · {{ veterinario.email }} · {{ veterinario.telefono }}
        </p>
      </div>
      <div class="flex gap-2">
        <Button size="icon" variant="outline" @click="$emit('editar', veterinario)">
          <PenLineIcon class="w-4 h-4" />
        </Button>

        <Button size="icon" variant="destructive" @click="$emit('eliminar', veterinario)">
          <TrashIcon class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <div>
      <Label class="text-sm font-medium flex items-center gap-1">
        <CalendarIcon class="w-4 h-4" /> Días de Trabajo
      </Label>
      <div class="flex flex-wrap gap-2 mt-1">
        <span
          v-for="dia in diasUnicos"
          :key="dia"
          class="bg-emerald-100 text-emerald-800 text-sm font-medium px-2 py-0.5 rounded-full"
        >
          {{ dia }}
        </span>
      </div>
    </div>

    <div>
      <Label class="text-sm font-medium">
        <ClockIcon class="w-4 h-4" />  Horarios</Label>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="hora in horariosUnicos"
          :key="Math.random()"
          class="bg-muted text-sm px-2 py-1 rounded-md"
        >
          {{ hora}}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { UsersIcon, PenLineIcon, TrashIcon, ClockIcon, CalendarIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { Horario, Veterinario } from '@/types/Veterinario'
import type { DiaSemana, Hora } from '@/constants/diasSemana'
import {horariosDisponibles } from '@/constants/diasSemana'

const props = defineProps<{
  veterinario: Veterinario
}>()

defineEmits(['editar', 'eliminar'])


const diasUnicos = computed(():DiaSemana[] => {
  const horarios: Horario[] | [] = props.veterinario.horarios ?? []
  return [...new Set(horarios.map(h => h.dia_semana))]
})

const horariosUnicos = computed((): Hora[] => {
  const horarios = props.veterinario.horarios ?? []
  const set = new Set(horarios.map(h => h.hora))
  return horariosDisponibles.filter(hora => set.has(hora))
})
</script>
