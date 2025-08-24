<template>
  <div class="mx-auto w-full max-w-md">
    <!-- Card -->
    <div class="login-card overflow-hidden rounded-xl border border-slate-200 shadow-md bg-white">
      <div class="px-5 py-5">

        <div class="mb-6 text-center">
          <h2 class="text-2xl font-bold text-slate-900 mb-2">Iniciar sesión</h2>
          <p class="text-sm text-slate-600">Ingresá tus credenciales para continuar</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Email -->
          <div class="space-y-1.5">
            <Label for="email" class="login-label">Email</Label>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="tu@email.com"
              :disabled="isLoading"
              class="login-input"
              :class="{ 'login-input--error': errors.email }"
              required
            />
            <p v-if="errors.email" class="login-error-msg">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <Label for="password" class="login-label">Contraseña</Label>
            <Input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="••••••••"
              :disabled="isLoading"
              class="login-input"
              :class="{ 'login-input--error': errors.password }"
              required
            />
            <p v-if="errors.password" class="login-error-msg">
              {{ errors.password }}
            </p>
          </div>

          <div class="space-y-3">
            <Button
              type="submit"
              class="login-btn w-full"
              :disabled="!isFormValid || isLoading"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              {{ isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
            </Button>

            <!-- Mensaje: iniciar sesión o registrarse -->
            <p class="text-center text-sm text-slate-600">
              ¿No tenés cuenta?
              <a
                href="/register"
                class="font-medium text-teal-700 hover:text-teal-800 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 rounded-sm"
              >
                Registrate
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLoginForm } from '@/composables/useLoginForm'
import type { LoginCredentials } from '@/types/Auth'

const {
  formData,
  errors,
  isLoading,
  isFormValid,
  validateForm,
  resetForm,
  submitLogin
} = useLoginForm()

const handleSubmit = async () => {
  if (!validateForm()) return
  try {
    const user = await submitLogin(formData.value as LoginCredentials)
    // emite eventos si es necesario en tu integración
    resetForm()
  } catch {
    // el composable ya setea loginError
  }
}
</script>

<style scoped>
/* Card header gradient y avatar redondo */
.login-card__header {
  background: linear-gradient(90deg, #00B2A9 0%, #00B7D3 100%);
}
.login-card__icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  background: rgba(255,255,255,0.25);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.35);
}

/* Labels */
.login-label {
  color: #111827;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Inputs: mejor focus ring, bordes suaves y estados */
.login-input {
  --ring: 0 0 0 3px rgba(0, 183, 204, 0.25);
  border-radius: 10px;
  border: 1px solid #E5E7EB;
  background: #fff;
  transition: box-shadow .15s ease, border-color .15s ease, background .15s ease, color .15s ease;
  height: 42px;
  padding-left: 0.875rem;
  padding-right: 0.875rem;
}
.login-input:focus {
  outline: none;
  border-color: #00B7D3;
  box-shadow: var(--ring);
}
.login-input:disabled {
  background: #F9FAFB;
  color: #9CA3AF;
  border-color: #E5E7EB;
}
.login-input--error {
  border-color: #EF4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

/* Error text */
.login-error-msg {
  font-size: 0.75rem;
  color: #EF4444;
}

/* Botón con look “gris deshabilitado / primario” */
.login-btn {
  height: 44px;
  border-radius: 10px;
  background: #00B2A9;
  transition: background .15s ease, transform .05s ease;
}
.login-btn:hover {
  background: #00A39B;
}
.login-btn:active {
  transform: translateY(1px);
}
.login-btn:disabled {
  background: #9CA3AF !important;
  cursor: not-allowed;
}

/* Card */
.login-card {
  backdrop-filter: saturate(1.1);
}
</style>