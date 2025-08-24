<template>
  <div>
    <HeaderPaciente />

    <!-- Mostrar login si no hay usuario -->
    <div v-if="!usuario">
      <LoginForm @login-success="onLoginSuccess" />
    </div>

    <!-- Mostrar selector de mascota si hay usuario -->
    <div v-else>
      <div class="space-y-4">
        <label for="mascota">Selecciona una mascota</label>
        <select v-model="mascotaSeleccionadaId" id="mascota" class="border rounded p-2 w-full">
          <option disabled value="">-- Elegí una mascota --</option>
          <option
            v-for="m in mascotas"
            :key="m.id"
            :value="m.id"
          >
            {{ m.nombre }}
          </option>
        </select>
      </div>

      <div class="mt-6 flex justify-between">
        <button @click="$emit('prev')" class="px-4 py-2 bg-gray-200 rounded">Atrás</button>
        <button @click="submit" class="px-4 py-2 bg-green-600 text-white rounded">Siguiente</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/useAuthStore'
import { useTurnoStore } from '@/store/useTurnoStore'
import HeaderPaciente from './HeaderPaciente.vue'
import LoginForm from '@/components/auth/LoginForm.vue'

const emit = defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()

const authStore = useAuthStore()
const turnoStore = useTurnoStore()

const usuario = computed(() => authStore.user)

interface Mascota {
  id: number
  nombre: string
}

const mascotas = ref<Mascota[]>([])
const mascotaSeleccionadaId = ref<number | ''>('')

function onLoginSuccess(){
  console.log();
}

mascotas.value = [
    { id: 1, nombre: 'Firulais' },
    { id: 2, nombre: 'Mishi' },
    { id: 3, nombre: 'Luna' },
  ]


function submit() {
  if (!mascotaSeleccionadaId.value) {
    alert('Por favor, seleccioná una mascota')
    return
  }

  turnoStore.setTurnoDatos({
    mascota_id: Number(mascotaSeleccionadaId.value),
    motivo: "Consulta",
  })

  emit('next')
}
</script>
