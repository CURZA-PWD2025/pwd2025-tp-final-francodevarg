<template>
  <div>
    <HeaderPaciente />

    <!-- Mostrar login si no hay usuario -->
    <div v-if="!usuario">
      <LoginForm @success="onLoginSuccess" />
    </div>

    <!-- Mostrar selector de mascota si hay usuario -->
    <div v-else>
      <MascotaSelect v-model="mascotaSeleccionadaId" />

      <div class="mt-6 flex justify-between">
        <button @click="$emit('prev')" class="px-4 py-2 bg-gray-200 rounded">Atrás</button>
        <button @click="submit" class="px-4 py-2 bg-green-600 text-white rounded">Siguiente</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { useAuthStore } from "@/store/useAuthStore"
import { useTurnoStore } from "@/store/useTurnoStore"
import { useMascotaStore } from "@/store/useMascotaStore"
import HeaderPaciente from "./HeaderPaciente.vue"
import LoginForm from "@/components/auth/LoginForm.vue"
import MascotaSelect from "@/components/MascotaSelect.vue"
import { on } from "events"

const emit = defineEmits<{
  (e: "prev"): void
  (e: "next"): void
}>()

const authStore = useAuthStore()
const turnoStore = useTurnoStore()
const mascotaStore = useMascotaStore()

const usuario = computed(() => authStore.user)
const mascotaSeleccionadaId = ref<number | "">("")

async function cargarMascotas() {
  if (usuario.value) {
    await mascotaStore.fetchMascotas(usuario.value.id)
  }
}

function onLoginSuccess() {
  mascotaStore.clearMascotas()
  cargarMascotas()
}

onMounted(() => {
    cargarMascotas()
})

watch(usuario, (nuevoUsuario) => {
  if (nuevoUsuario) {
    cargarMascotas()
  }
})

function submit() {
  if (!mascotaSeleccionadaId.value) {
    alert("Por favor, seleccioná una mascota")
    return
  }

  turnoStore.setTurnoDatos({
    mascota_id: Number(mascotaSeleccionadaId.value),
    motivo: "Consulta",
  })

  emit("next")
}
</script>