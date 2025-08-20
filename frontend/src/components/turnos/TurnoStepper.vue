<template>
    <div class="">
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

function finish() {
  console.log('🚀 Payload final listo:', turnoStore.turno)
}
</script>
