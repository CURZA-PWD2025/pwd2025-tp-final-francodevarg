<template>
    <div class="bg-white rounded-xl shadow-sm border border-border p-6 space-y-3">
      <div class="flex items-start justify-between">
        <div>
          <h4 class="font-bold text-lg flex items-center gap-2">
            <UsersIcon class="w-5 h-5" />
            {{ nombre }}
          </h4>
          <p class="text-sm text-muted-foreground">{{ especialidad }} · {{ email }} · {{ telefono }}</p>
        </div>
        <div class="flex gap-2">
          <Button size="icon" variant="outline"><PenLineIcon class="w-4 h-4" /></Button>
          <Button size="icon" variant="destructive"><TrashIcon class="w-4 h-4" /></Button>
        </div>
      </div>
  
      <div>
        <Label class="text-sm font-medium flex items-center gap-1">
          <ClockIcon class="w-4 h-4" /> Días de Trabajo
        </Label>
        <div class="flex flex-wrap gap-2 mt-1">
          <span
            v-for="dia in dias"
            :key="dia"
            class="bg-emerald-100 text-emerald-800 text-sm font-medium px-2 py-0.5 rounded-full"
          >
            {{ dia }}
          </span>
        </div>
      </div>
  
      <div>
        <Label class="text-sm font-medium">Horarios</Label>
        <div class="flex flex-wrap gap-2 mt-1">
          <span
            v-for="hora in horarios"
            :key="hora"
            class="bg-gray-100 text-sm font-mono px-2 py-0.5 rounded"
          >
            {{ hora }}
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { UsersIcon, PenLineIcon, TrashIcon, ClockIcon } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { Label } from '@/components/ui/label'
  
  defineProps<{
    nombre: string
    especialidad: string
    email: string
    telefono: string
    dias: string[]
    horarios: string[]
  }>()
  </script>
  