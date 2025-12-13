<template>
  <div>
    <HeaderPaciente />

    <!-- 1) Mostrar login si no hay usuario -->
    <div v-if="!user">
      <AuthForm @success="onLoginSuccess" />
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

      <!-- Selección o Creación de Mascota -->
      <section>
        <div v-if="hasMascotas">
          <h2 class="text-lg font-semibold text-slate-800 mb-2">Seleccioná tu mascota</h2>
          <MascotaSelect
            v-model="mascota_id"
            @mascotaSeleccionada="setMascota"
          />
          <span v-if="mascotaIdError" class="text-sm text-red-500">{{ mascotaIdError }}</span>
        </div>

        <!-- Formulario de creación de mascota si no hay mascotas registradas -->
        <div v-else class="space-y-4 p-4 border rounded-md bg-slate-50">
          <h2 class="text-lg font-semibold text-slate-800 mb-2">Registrá tu mascota</h2>
          <p class="text-sm text-slate-600 mb-4">No tenés mascotas registradas. Completá los datos para continuar.</p>
          
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input
                v-model="newMascota.nombre"
                type="text"
                class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Nombre de tu mascota"
              />
              <span v-if="errors.nombre" class="text-xs text-red-500">{{ errors.nombre }}</span>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Especie</label>
                <select
                  v-model="newMascota.especie"
                  class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Otro">Otro</option>
                </select>
                <span v-if="errors.especie" class="text-xs text-red-500">{{ errors.especie }}</span>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Edad (años)</label>
                <input
                  v-model.number="newMascota.edad"
                  type="number"
                  min="0"
                  class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span v-if="errors.edad" class="text-xs text-red-500">{{ errors.edad }}</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Raza</label>
              <input
                v-model="newMascota.raza"
                type="text"
                class="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ej: Caniche, Mestizo..."
              />
               <span v-if="errors.raza" class="text-xs text-red-500">{{ errors.raza }}</span>
            </div>
          </div>
        </div>
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
          class="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-green-700"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">Procesando...</span>
          <span v-else>Siguiente</span>
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
import AuthForm from '@/components/auth/AuthForm.vue'
import MascotaSelect from '@/components/mascotas/MascotaSelect.vue'
import { useTurnoStore } from '@/store/useTurnoStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useMascotaStore } from '@/store/useMascotaStore'
import type { Mascota } from '@/types/Mascota'
import { useMascotaForm } from '@/composables/useMascotaForm'

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

import { useTurnoForm } from '@/composables/useTurnoForm'
const { motivo, motivoError, mascota_id, mascotaIdError, submitStep2 } = useTurnoForm()

// Composable de Mascota
const { newMascota, errors,isSubmitting, crearMascota } = useMascotaForm()

const turnoStore = useTurnoStore()
const authStore = useAuthStore()
const mascotaStore = useMascotaStore()
const router = useRouter()

const { turno, mascota, veterinario } = storeToRefs(turnoStore)
const { user } = storeToRefs(authStore)
const { items: mascotas } = storeToRefs(mascotaStore)

/** --- Guardia de rol --- */
const isCliente = computed(() => user.value?.tipo === 'cliente')

/** --- Lógica de Mascotas --- */
const hasMascotas = computed(() => mascotas.value.length > 0)

// Estado de carga local del componente (para el botón Siguiente)

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
  // Los datos se cargan automáticamente después del login
  // Si después del login no es cliente, disparar cuenta regresiva:
  if (user.value && !isCliente.value) startCountdown()
}

function setMascota(mascotaemited: Mascota) {
  mascota.value = mascotaemited
}

async function submit() {
  // Guardia adicional por si alguien manipula el DOM
  if (!isCliente.value) {
    alert('Solo los clientes pueden solicitar un turno.')
    return
  }

  isSubmitting.value = true
  try {
    // Si NO tiene mascotas, primero creamos la mascota
    if (!hasMascotas.value) {
      if (!user.value?.id) {
         isSubmitting.value = false
         return
      }
      
      const createdMascota = await crearMascota(user.value.id)
      if (!createdMascota) {
        // Falló validación o creación
        isSubmitting.value = false
        return 
      }

      // Asignamos la nueva mascota al formulario
      mascota_id.value = createdMascota.id || 0
      mascota.value = createdMascota
    }

    // Proseguir con validación y envío (Step 2)
    const turnoFinal = await submitStep2()
    if (turnoFinal) {
      turnoStore.setTurnoDatos(turnoFinal)
      emit('next')
    }
    
  } catch (e) {
    console.error("Error en submit", e)
  } finally {
    isSubmitting.value = false
  }
}
</script>
