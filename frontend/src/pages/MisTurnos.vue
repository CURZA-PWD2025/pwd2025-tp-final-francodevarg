<template>
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
              <SelectItem value="Confirmado">Confirmado</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
              <SelectItem value="Completado">Completado</SelectItem>
            </SelectContent>
          </Select>
          <span class="hidden sm:inline text-sm text-slate-600"></span>
        </div>
      </header>

      <p class="sm:hidden text-sm text-slate-600 mb-4"></p>

      <!-- Lista -->
      <div class="space-y-4">
        <TurnoCard
          v-for="t in storeTurno.turnosFiltrados"
          :key="t.id"
          :turno="t"
          :roleUser="'cliente'"
          @cancelar="cancelar"
        />
      </div>

      <!-- Empty state -->
      <div v-if="storeTurno.turnosFiltrados.length === 0"
           class="text-center py-20 text-slate-500">
        <CalendarX class="w-8 h-8 mx-auto mb-3 text-slate-400" />
        No hay turnos para el filtro seleccionado.
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
import { useAuthStore } from '@/store/useAuthStore'
import TurnoService from '@/services/TurnoService'
import type { FiltroTurno } from '@/types/Turno'
import type { AcceptableValue } from 'reka-ui'

const storeTurno = useMisTurnos()
const storeAuth = useAuthStore()
const filtro = ref<AcceptableValue>("todos")

function onFiltroChange(val: AcceptableValue) {
  if (val === undefined) return

  let filtro: FiltroTurno = val as FiltroTurno
  storeTurno.setFiltro(filtro)
}

onMounted(() => {
  storeTurno.fetchTurnos(storeAuth.user!.id)
})


async function cancelar(id: number) {
  console.log("Cancelar turno", id)

  TurnoService.cancel(id)
    .then(() => {
      storeTurno.fetchTurnos(storeAuth.user!.id)
    })
    .catch((error) => {
      console.error("Error al cancelar el turno", error)
    })
}
</script>
