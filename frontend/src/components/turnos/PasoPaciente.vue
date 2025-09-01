<template>
  <div>
    <HeaderPaciente />

    <!-- 1) Mostrar login si no hay usuario -->
    <div v-if="!user">
      <LoginForm @success="onLoginSuccess" />
    </div>

    <!-- 2) Bloqueo por rol (admin / no cliente) con redirección -->
    <div
      v-else-if="!isCliente"
      class="max-w-xl mx-auto bg-white p-6 space-y-4 rounded-lg border shadow-sm"
    >
      <div class="flex items-start gap-3">
        <div class="shrink-0 rounded-full bg-red-50 p-2 border border-red-100">
          <ShieldAlert class="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-slate-900">Acceso restringido</h2>
          <p class="text-sm text-slate-700">
            El usuario <strong>{{ user?.nombre }}</strong> tiene rol
            <span class="font-semibold uppercase">{{ user?.tipo }}</span>.
            Solo los usuarios <strong>tipo cliente</strong> pueden solicitar un turno.
          </p>
          <p class="mt-3 text-sm font-medium text-emerald-700">
            Será redirigido en {{ countdown }}…
          </p>

          <div class="mt-3 flex items-center gap-3">
            <button
              type="button"
              class="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
              @click="goNow"
            >
              Ir ahora a Turnos
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 3) Flujo normal para CLIENTE -->
    <div v-else class="max-w-xl mx-auto bg-white p-6 space-y-6 rounded-lg border shadow-sm">
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
            id="motivo"
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import HeaderPaciente from './HeaderPaciente.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import MascotaSelect from '@/components/MascotaSelect.vue'

import { useTurnoStore } from '@/store/useTurnoStore'
import { useAuthEffects } from '@/composables/useAuthEffects'
import { useAuthStore } from '@/store/useAuthStore'
import type { Mascota } from '@/types/Mascota'

import {
  User,
  Mail,
  FileText,
  Calendar,
  Clock,
  Hospital,
  Stethoscope,
  ShieldAlert
} from 'lucide-vue-next'

const emit = defineEmits<{ (e: 'prev'): void; (e: 'next'): void }>()

useAuthEffects()

import { useTurnoForm } from '@/composables/useTurnoForm'
const { motivo, motivoError, mascota_id, mascotaIdError, submitStep2 } = useTurnoForm()

const turnoStore = useTurnoStore()
const authStore = useAuthStore()
const router = useRouter()

const { turno, mascota, veterinario } = storeToRefs(turnoStore)
const { user } = storeToRefs(authStore)

/** --- Guardia de rol --- */
const isCliente = computed(() => user.value?.tipo === 'cliente')

/** --- Redirección automática para no-cliente (admin, veterinario, etc.) --- */
const countdown = ref(3)
let timer: number | null = null

function startCountdown() {
  stopCountdown()
  countdown.value = 3
  timer = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      goNow()
    }
  }, 1000)
}
function stopCountdown() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
function goNow() {
  stopCountdown()
  router.push('/admin')
}

onMounted(() => {
  if (user.value && !isCliente.value) {
    startCountdown()
  }
})
onBeforeUnmount(stopCountdown)

function onLoginSuccess() {
  // useAuthEffects refresca el estado automáticamente
  // Si después del login no es cliente, disparar cuenta regresiva:
  if (user.value && !isCliente.value) startCountdown()
}

function setMascota(mascotaemited: Mascota) {
  mascota.value = mascotaemited
}

async function submit() {
  // Guardia adicional por si alguien manipula el DOM
  if (!isCliente.value) {
    // feedback rápido; igual se redirige por el contador
    alert('Solo los clientes pueden solicitar un turno.')
    return
  }

  const turnoFinal = await submitStep2()
  if (turnoFinal) {
    turnoStore.setTurnoDatos(turnoFinal)
    emit('next')
  }
}
</script>
