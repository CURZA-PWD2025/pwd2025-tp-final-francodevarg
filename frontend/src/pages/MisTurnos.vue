<template>
  <div class="min-h-[calc(100vh-64px)] bg-gradient-to-b from-emerald-50/60 via-white to-white">
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <header class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div class="rounded-xl bg-primary/10 text-primary inline-flex items-center justify-center w-10 h-10">
            <CalendarDays class="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-xl font-semibold text-slate-900">Mis Turnos</h1>
            <p class="text-sm text-slate-600">Gestioná tus citas veterinarias</p>
          </div>
        </div>

        <!-- Filtro de estado -->
        <div class="flex items-center gap-3">
          <Select v-model="filtro" @update:modelValue="onFiltroChange">
            <SelectTrigger class="w-[220px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
              <SelectItem value="completado">Completado</SelectItem>
            </SelectContent>
          </Select>
          <span class="hidden sm:inline text-sm text-slate-600">{{ store.resumenMostrando }}</span>
        </div>
      </header>

      <p class="sm:hidden text-sm text-slate-600 mb-4">{{ store.resumenMostrando }}</p>

      <!-- Lista -->
      <div class="space-y-4">
        <TurnoCard
          v-for="t in store.turnosFiltrados"
          :key="t.id"
          :turno="t"
          @cancelar="cancelar"
          @reprogramar="reprogramar"
        />
      </div>

      <!-- Empty state -->
      <div v-if="store.turnosFiltrados.length === 0"
           class="text-center py-20 text-slate-500">
        <CalendarX class="w-8 h-8 mx-auto mb-3 text-slate-400" />
        No hay turnos para el filtro seleccionado.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMisTurnos } from '@/store/useMisTurnosStore'
import TurnoCard from '@/components/turnos/TurnoCard.vue'
import { CalendarDays, CalendarX } from 'lucide-vue-next'

// shadcn-vue
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const store = useMisTurnos()
const filtro = ref(store.filtroEstado)

onMounted(() => {
  if (!store.turnos.length) store.cargarMock()
})

function onFiltroChange(val: typeof store.filtroEstado) {
  store.setFiltro(val)
}

async function cancelar(id: number) {
  await store.cancelarTurno(id)
}

function reprogramar(id: number) {
  store.reprogramarTurno(id)
}
</script>
