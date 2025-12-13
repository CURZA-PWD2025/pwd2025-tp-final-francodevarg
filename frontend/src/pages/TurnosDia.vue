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

        <div class="flex items-center gap-2">
            <!-- Filtro de Fecha -->
            <Filter class="w-4 h-4 text-slate-500" />
            <select 
                v-model="filtroFecha" 
                @change="aplicarFiltro"
                class="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
            >
                <option value="hoy">Hoy</option>
                <option value="ayer">Ayer</option>
                <option value="esta_semana">Esta Semana</option>
                <option value="semana_pasada">Semana Pasada</option>
                <option value="este_mes">Este Mes</option>
            </select>

            <!-- Filtro de Estado -->
            <Select v-model="filtroEstado" @update:modelValue="onFiltroEstadoChange">
              <SelectTrigger class="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Confirmado">Confirmado</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
              </SelectContent>
            </Select>
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
import { CalendarDays, CalendarX, Filter } from 'lucide-vue-next'
import TurnoService from '@/services/TurnoService'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { FiltroTurno } from '@/types/Turno'
import type { AcceptableValue } from 'reka-ui'

const storeTurno = useMisTurnos()
const filtroFecha = ref('hoy')
const filtroEstado = ref<AcceptableValue>('todos')

function onFiltroEstadoChange(val: AcceptableValue) {
  if (val === undefined) return
  let filtro: FiltroTurno = val as FiltroTurno
  storeTurno.setFiltro(filtro)
}

onMounted(() => {
  aplicarFiltro()
})

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function aplicarFiltro() {
  const hoy = new Date()
  let inicio = ''
  let fin = ''

  switch (filtroFecha.value) {
    case 'hoy':
      inicio = formatDate(hoy)
      fin = inicio
      break
    case 'ayer':
      const ayer = new Date(hoy)
      ayer.setDate(hoy.getDate() - 1)
      inicio = formatDate(ayer)
      fin = inicio
      break
    case 'esta_semana': {
      const day = hoy.getDay() // 0 (Sun) - 6 (Sat)
      const diffToMonday = day === 0 ? 6 : day - 1
      
      const monday = new Date(hoy)
      monday.setDate(hoy.getDate() - diffToMonday)
      
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      
      inicio = formatDate(monday)
      fin = formatDate(sunday)
      break
    }
    case 'semana_pasada': {
      const day = hoy.getDay()
      const diffToMonday = day === 0 ? 6 : day - 1
      
      const lastMonday = new Date(hoy)
      lastMonday.setDate(hoy.getDate() - diffToMonday - 7)
      
      const lastSunday = new Date(lastMonday)
      lastSunday.setDate(lastMonday.getDate() + 6)
      
      inicio = formatDate(lastMonday)
      fin = formatDate(lastSunday)
      break
    }
    case 'este_mes': {
      const firstDay = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      const lastDay = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
      
      inicio = formatDate(firstDay)
      fin = formatDate(lastDay)
      break
    }
  }

  storeTurno.fetchTurnosByFecha(inicio, fin)
}


function completar(id: number) {
  TurnoService.complete(id).then(() => {
    aplicarFiltro()
  }).catch((error) => {
    console.error("Error al confirmar el turno", error)
  })
}


function cancelar(id: number) {
  TurnoService.cancel(id).then(() => {
    aplicarFiltro()
  }).catch((error) => {
    console.error("Error al confirmar el turno", error)
  })
}

function confirmar(id: number) {
  TurnoService.confirm(id).then(() => {
    aplicarFiltro()
  }).catch((error) => {
    console.error("Error al confirmar el turno", error)
  })
}

</script>
