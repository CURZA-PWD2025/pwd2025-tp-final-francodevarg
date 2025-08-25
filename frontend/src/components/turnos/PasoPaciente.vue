<template>
  <div>
    <HeaderPaciente />

    <!-- Mostrar login si no hay usuario -->
    <div v-if="!user">
      <LoginForm @success="onLoginSuccess" />
    </div>

    <!-- Mostrar selector de mascota y resumen si hay usuario -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Columna izquierda: Selector -->
        <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 class="text-lg font-semibold text-slate-800 mb-3">Seleccioná tu mascota</h2>
          <MascotaSelect v-model="mascotaSeleccionadaId" />

          <div class="mt-6 flex justify-between">
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

        <!-- Columna derecha: Resumen -->
        <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 class="text-lg font-semibold text-slate-800 mb-3">Resumen</h2>

          <!-- Datos del usuario -->
          <section class="mb-4">
            <h3 class="text-sm font-medium text-slate-600 mb-2">Tus datos</h3>
            <ul class="space-y-1 text-sm">
              <li><span class="font-medium">Nombre:</span> {{ user?.nombre }}</li>
              <li><span class="font-medium">Email:</span> {{ user?.email }}</li>
            </ul>
          </section>

          <!-- Datos del turno -->
          <section>
            <h3 class="text-sm font-medium text-slate-600 mb-2">Turno</h3>
            <ul class="space-y-1 text-sm">
              <li><span class="font-medium">Motivo:</span> {{ turno?.motivo || 'Consulta' }}</li>
              <li><span class="font-medium">Fecha:</span> {{ turno?.fecha || '—' }}</li>
              <li><span class="font-medium">Hora:</span> {{ turno?.hora || '—' }}</li>
              <li><span class="font-medium">Veterinario:</span> {{ veterinario?.nombre || '—' }}</li>
              <li><span class="font-medium">Especialidad:</span> {{ veterinario?.especialidad || '—' }}</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { storeToRefs } from "pinia"
import HeaderPaciente from "./HeaderPaciente.vue"
import LoginForm from "@/components/auth/LoginForm.vue"
import MascotaSelect from "@/components/MascotaSelect.vue"

import { useTurnoStore } from "@/store/useTurnoStore"
import { useAuthEffects } from "@/composables/useAuthEffects"
import { useAuthStore } from "@/store/useAuthStore"
import { useVeterinarioStore } from "@/store/useVeterinarioStore"

const emit = defineEmits<{
  (e: "prev"): void
  (e: "next"): void
}>()

// Efecto: carga mascotas si usuario es cliente
useAuthEffects()

const turnoStore = useTurnoStore()
const veterinarioStore = useVeterinarioStore()
const authStore = useAuthStore()

const { turno } = storeToRefs(turnoStore)
const { veterinario } = storeToRefs(veterinarioStore)
const { user } = storeToRefs(authStore)


const mascotaSeleccionadaId = ref<number | null>(null)

function onLoginSuccess() {
  // useAuthEffects() ya reacciona
}


function submit() {
  if (!mascotaSeleccionadaId.value) {
    alert("Por favor, seleccioná una mascota")
    return
  }

  turnoStore.setTurnoDatos({
    ...turno.value,
    mascota_id: Number(mascotaSeleccionadaId.value),
  })

  emit("next")
}
</script>
