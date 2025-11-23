<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import AuthCard from './AuthCard.vue'
import AuthInput from './AuthInput.vue'
import { useAuthForm } from '@/composables/useAuthForm'
import type { Usuario } from '@/types/Usuario'

const emit = defineEmits<{
  (e: 'success', user: Usuario | null): void
}>()

const { selectedSchema, backendError, isFormValid, onSubmit, toggleMode } = useAuthForm(emit)
</script>

<template>
  <AuthCard
    :title="selectedSchema === 'login' ? 'Iniciar sesión' : 'Registrarse'"
    :subtitle="selectedSchema === 'login'
      ? 'Ingresá tus credenciales para continuar'
      : 'Completá tus datos para crear una cuenta'"
  >
    <form @submit.prevent="onSubmit" class="space-y-5">
      <AuthInput
        v-if="selectedSchema === 'register'"
        id="nombre"
        name="nombre"
        label="Nombre"
        type="text"
        placeholder="Tu nombre"
        autocomplete="Nombre"
      />

      <AuthInput
        id="email"
        name="email"
        label="Email"
        type="email"
        placeholder="tu@email.com"
      />

      <AuthInput
        id="password"
        name="password"
        label="Contraseña"
        type="password"
        autocomplete="current-password"
      />

      <AuthInput
        v-if="selectedSchema === 'register'"
        id="passwordConfirm"
        name="passwordConfirm"
        label="Confirmar contraseña"
        type="password"
        autocomplete="new-password"
      />

    <Transition name="fade">
    <div
        v-if="backendError"
        class="flex items-center justify-between text-sm text-red-600 font-medium bg-red-50 border border-red-200 px-3 py-2 rounded"
    >
        <span>{{ backendError }}</span>
        <!-- Botón para cerrar -->
        <button
        type="button"
        @click="backendError = null"
        class="ml-2 text-red-400 hover:text-red-600"
        >
        ✕
        </button>
    </div>
    </Transition>



      <div class="space-y-3">
        <Button
          type="submit" 
          class="login-btn w-full"
          :disabled="!isFormValid"
        >
          <Loader2 v-if="false" class="mr-2 h-4 w-4 animate-spin" />
          {{ selectedSchema === 'login' ? 'Iniciar sesión' : 'Registrarse' }}
        </Button>

        <p class="text-center text-sm text-slate-600">
          {{ selectedSchema === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?' }}
          <button
            type="button"
            class="font-medium text-teal-700 hover:text-teal-800 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 rounded-sm"
            @click="toggleMode"
          >
            {{ selectedSchema === 'login' ? 'Registrate' : 'Iniciá sesión' }}
          </button>
        </p>
      </div>
    </form>
  </AuthCard>
</template>


<style scoped>
.login-label {
  color: #111827;
  font-size: 0.875rem;
  font-weight: 600;
}

.login-input {
  --ring: 0 0 0 3px rgba(0, 183, 204, 0.25);
  border-radius: 10px;
  border: 1px solid #E5E7EB;
  background: #fff;
  transition: box-shadow .15s ease, border-color .15s ease;
  height: 42px;
  padding: 0 0.875rem;
}
.login-input:focus {
  outline: none;
  border-color: #00B7D3;
  box-shadow: var(--ring);
}
.login-input--error {
  border-color: #EF4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}
.login-error-msg {
  font-size: 0.75rem;
  color: #EF4444;
}
.login-btn {
  height: 44px;
  border-radius: 10px;
  background: #00B2A9;
  transition: background .15s ease, transform .05s ease;
}
.login-btn:hover {
  background: #00A39B;
}
.login-btn:disabled {
  background: #9CA3AF !important;
  cursor: not-allowed;
}

</style>