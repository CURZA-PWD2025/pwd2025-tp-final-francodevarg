<template>
  <div>
    <HeaderPaciente />

    <!-- Mostrar login si no hay usuario -->
    <div v-if="!user">
      <LoginForm @success="onLoginSuccess" />
    </div>

    <!-- Mostrar selector si hay usuario -->
    <div v-else class="max-w-xl mx-auto bg-white p-6 space-y-6">
      
      <!-- Datos del usuario -->
      <section>
        <h2 class="text-lg font-semibold text-slate-800 mb-3">Tus datos</h2>
        <ul class="space-y-2 text-sm">
          <li class="flex items-center gap-2">
            <User class="w-4 h-4 text-slate-500" />
            <span><span class="font-medium">Nombre:</span> {{ user?.nombre }}</span>
          </li>
          <li class="flex items-center gap-2">
            <Mail class="w-4 h-4 text-slate-500" />
            <span><span class="font-medium">Email:</span> {{ user?.email }}</span>
          </li>
        </ul>
      </section>

      <!-- Datos del turno -->
      <section>
        <h2 class="text-lg font-semibold text-slate-800 mb-3">Turno</h2>
        <ul class="space-y-2 text-sm">
          <li class="flex items-center gap-2">
            <FileText class="w-4 h-4 text-slate-500" />
            <span><span class="font-medium">Motivo:</span> {{ turno?.motivo || motivo }}</span>
          </li>
          <li class="flex items-center gap-2">
            <Calendar class="w-4 h-4 text-slate-500" />
            <span><span class="font-medium">Fecha:</span> {{ turno?.fecha || '—' }}</span>
          </li>
          <li class="flex items-center gap-2">
            <Clock class="w-4 h-4 text-slate-500" />
            <span><span class="font-medium">Hora:</span> {{ turno?.hora || '—' }}</span>
          </li>
          <li class="flex items-center gap-2">
            <Stethoscope class="w-4 h-4 text-slate-500" />
            <span><span class="font-medium">Veterinario:</span> {{ veterinario?.nombre || '—' }}</span>
          </li>
          <li class="flex items-center gap-2">
            <Hospital class="w-4 h-4 text-slate-500" />
            <span><span class="font-medium">Especialidad:</span> {{ veterinario?.especialidad || '—' }}</span>
          </li>
        </ul>
      </section>

      <!-- Selector de mascota -->
      <section>
        <h2 class="text-lg font-semibold text-slate-800 mb-2">Seleccioná tu mascota</h2>
        <MascotaSelect
          v-model="mascota_id"
          @mascotaSeleccionada="setMascota"
        />
        <span v-if="mascotaIdError" class="text-sm text-red-500">{{ mascotaIdError }}</span>
      </section>

      <!-- Input motivo -->
      <section>
        <label for="motivo" class="block text-sm font-medium text-slate-700 mb-1">Motivo de la consulta</label>
        <div class="relative">
          <FileText class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            v-model="motivo"
            type="text"
            placeholder="Ej: Control anual, vacunación..."
            class="w-full pl-10 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span v-if="motivoError" class="text-sm text-red-500">{{ motivoError }}</span>

        </div>
      </section>

      <!-- Botones -->
      <div class="flex justify-between pt-4 border-t border-slate-200">
        <button
          @click="$emit('prev')"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Atrás
        </button>
        <button
          @click="submit"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import HeaderPaciente from "./HeaderPaciente.vue"
import LoginForm from "@/components/auth/LoginForm.vue"
import MascotaSelect from "@/components/MascotaSelect.vue"

import { useTurnoStore } from "@/store/useTurnoStore"
import { useAuthEffects } from "@/composables/useAuthEffects"
import { useAuthStore } from "@/store/useAuthStore"

// Lucide icons (ShadCN)
import {
  User,
  Mail,
  FileText,
  Calendar,
  Clock,
  Hospital,
  Stethoscope
} from 'lucide-vue-next'

const emit = defineEmits<{
  (e: "prev"): void
  (e: "next"): void
}>()

useAuthEffects()

import { useTurnoForm } from '@/composables/useTurnoForm'

const {
  motivo, motivoError,
  mascota_id, mascotaIdError,
  submitStep2
} = useTurnoForm()



const turnoStore = useTurnoStore()
const authStore = useAuthStore()

const { turno, mascota, veterinario } = storeToRefs(turnoStore)
const { user } = storeToRefs(authStore)


function onLoginSuccess() {
  // se recarga por efecto
}

function setMascota(mascotaemited: Mascota) {
  mascota.value = mascotaemited
}

async function submit() {
  const turnoFinal = await submitStep2()
  if (turnoFinal) {
    emit("next")
    turnoStore.setTurnoDatos(turnoFinal)

  }
}

</script>
