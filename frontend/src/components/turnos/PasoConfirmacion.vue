<template>
  <div class="space-y-6">
    <!-- Encabezado superior -->
    <HeaderConfirmacion />

    <!-- Contenedor unificado de detalles -->
    <div class="rounded-lg border p-6 bg-white shadow-sm text-slate-800 space-y-4">
      <h3 class="text-base font-semibold flex items-center gap-2 text-primary">
        <CalendarDays class="w-5 h-5" />
        Detalles del Turno
      </h3>

      <!-- Veterinario -->
      <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <User class="w-4 h-4 mt-0.5 text-muted-foreground" />
        <div><strong>Veterinario:</strong> {{ veterinario?.nombre }}</div>

        <Stethoscope class="w-4 h-4 mt-0.5 text-muted-foreground" />
        <div><strong>Especialidad:</strong> {{ veterinario?.especialidad }}</div>

        <Mail class="w-4 h-4 mt-0.5 text-muted-foreground" />
        <div><strong>Email:</strong> {{ veterinario?.email }}</div>

        <Phone class="w-4 h-4 mt-0.5 text-muted-foreground" />
        <div><strong>Teléfono:</strong> {{ veterinario?.telefono }}</div>
      </div>

      <!-- Mascota -->
      <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm pt-4 border-t border-muted">
        <Dog class="w-4 h-4 mt-0.5 text-muted-foreground" />
        <div><strong>Mascota:</strong> {{ mascota?.nombre }}</div>

        <PawPrint class="w-4 h-4 mt-0.5 text-muted-foreground" />
        <div><strong>Especie:</strong> {{ mascota?.especie }}</div>

        <Clock class="w-4 h-4 mt-0.5 text-muted-foreground" />
        <div><strong>Edad:</strong> {{ mascota?.edad }} años</div>
      </div>

      <!-- Datos del turno -->
      <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm pt-4 border-t border-muted">
        <CalendarIcon class="w-4 h-4 mt-0.5 text-muted-foreground" />
        <div><strong>Fecha:</strong> {{ turno.fecha }}</div>

        <Clock class="w-4 h-4 mt-0.5 text-muted-foreground" />
        <div><strong>Hora:</strong> {{ turno.hora }}</div>

        <MessageSquare class="w-4 h-4 mt-0.5 text-muted-foreground" />
        <div><strong>Motivo:</strong> {{ turno.motivo || 'No especificado' }}</div>
      </div>
    </div>

    <!-- Botones -->
    <div class="flex justify-between">
      <Button variant="secondary" @click="$emit('prev')">
        <ArrowLeft class="w-4 h-4 mr-2" /> Atrás
      </Button>
      <Button @click="$emit('finish')" class="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white">
        Confirmar <Check class="w-4 h-4 ml-2" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTurnoStore } from '@/store/useTurnoStore'
import { storeToRefs } from 'pinia'
import HeaderConfirmacion from './HeaderConfirmacion.vue'
import { Button } from '@/components/ui/button'
import {
  Check,
  CheckCircle,
  ArrowLeft,
  Calendar as CalendarIcon,
  CalendarDays,
  Clock,
  User,
  Dog,
  PawPrint,
  Phone,
  Mail,
  Stethoscope,
  MessageSquare,
} from 'lucide-vue-next'

const turnoStore = useTurnoStore()
const { turno, mascota, veterinario } = storeToRefs(turnoStore)
</script>
