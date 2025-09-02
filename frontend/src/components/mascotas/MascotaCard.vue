<script setup lang="ts">
import type { Mascota } from '@/types/Mascota'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dog, Calendar, Pencil, Trash2 } from 'lucide-vue-next'

const props = defineProps<{
  mascota: Mascota
}>()

const emit = defineEmits<{
  (e: 'edit', mascota: Mascota): void
  (e: 'delete', id: number): void
}>()
</script>

<template>
  <Card class="border-emerald-100 shadow-sm rounded-xl hover:shadow-md transition">
    <CardHeader class="pb-2">
      <CardTitle class="flex items-center gap-2 text-emerald-800 text-lg">
        <Dog class="w-5 h-5 text-emerald-600" />
        {{ props.mascota.nombre }}
      </CardTitle>
    </CardHeader>

    <CardContent class="text-sm text-slate-700 space-y-1">
      <p><strong>Especie:</strong> {{ props.mascota.especie }}</p>
      <p><strong>Raza:</strong> {{ props.mascota.raza || '—' }}</p>
      <p class="flex items-center gap-1">
        <Calendar class="w-4 h-4 text-emerald-500" />
        <span><strong>Edad:</strong> {{ props.mascota.edad }} años</span>
      </p>

      <div class="flex gap-2 pt-3">
        <Button variant="outline" size="sm" class="gap-2" @click="emit('edit', props.mascota)">
          <Pencil class="w-4 h-4" /> Editar
        </Button>
        <Button variant="outline" size="sm" class="gap-2 text-red-700 border-red-200 hover:bg-red-50"
          @click="emit('delete', props.mascota.id!)">
          <Trash2 class="w-4 h-4" /> Eliminar
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
