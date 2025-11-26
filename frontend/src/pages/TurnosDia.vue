<template>
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <header class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div class="rounded-xl bg-primary/10 text-primary inline-flex items-center justify-center w-10 h-10">
            <CalendarDays class="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-xl font-semibold text-slate-900">Turnos del Dia</h1>
          </div>
        </div>

      </header>

      <p class="sm:hidden text-sm text-slate-600 mb-4"></p>

      <!-- Lista -->
      <div class="space-y-4">
        <TurnoCard
          v-for="t in storeTurno.turnosFiltrados"
          :key="t.id"
          :turno="t"
          :roleUser="'admin'"
          @completar="completar"
          @cancelar="cancelar"
          @confirmar="confirmar"
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
import TurnoService from '@/services/TurnoService'

const storeTurno = useMisTurnos()
ref(storeTurno.filtroEstado)

onMounted(() => {
  if (!storeTurno.turnos.length) storeTurno.fetchTurnosByFecha()
})


function completar(id: number) {
  TurnoService.complete(id).then(() => {
    storeTurno.fetchTurnosByFecha()
  }).catch((error) => {
    console.error("Error al confirmar el turno", error)
  })

  console.log("Confirmar turno", id)
}


function cancelar(id: number) {
  TurnoService.cancel(id).then(() => {
    storeTurno.fetchTurnosByFecha()
  }).catch((error) => {
    console.error("Error al confirmar el turno", error)
  })

  console.log("Confirmar turno", id)
}

function confirmar(id: number) {
  TurnoService.confirm(id).then(() => {
    storeTurno.fetchTurnosByFecha()
  }).catch((error) => {
    console.error("Error al confirmar el turno", error)
  })

  console.log("Confirmar turno", id)
}

</script>
