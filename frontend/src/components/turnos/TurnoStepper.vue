<template>
    <div>
      <FormTurno
        v-if="currentStep === 1"
        @next="goToStep(2)"
      />

      <PasoPaciente
        v-if="currentStep === 2"
        @prev="goToStep(1)"
        @next="goToStep(3)"
      />

      <PasoConfirmacion
        v-if="currentStep === 3"
        @prev="goToStep(2)"
        @finish="finish"
      />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FormTurno from '@/components/turnos/FormTurno.vue'
import PasoPaciente from '@/components/turnos/PasoPaciente.vue'
import PasoConfirmacion from '@/components/turnos/PasoConfirmacion.vue'
import { useTurnoStore } from '@/store/useTurnoStore'

const currentStep = ref<1 | 2 | 3>(1)
const turnoStore = useTurnoStore()

function goToStep(step: 1 | 2 | 3) {
  currentStep.value = step
}

async function finish() {
  try {
    const data = await turnoStore.finish()
    console.log('🚀 Turno enviado con éxito:', data)
    alert('Turno creado correctamente')
    currentStep.value = 1 // Reiniciar pasos o redirigir
  } catch (err) {
    alert('Error al crear el turno')
  }
}

</script>
