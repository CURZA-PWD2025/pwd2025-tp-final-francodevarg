<template>
  <form @submit.prevent="handleLogin" class="space-y-4">
    <input v-model="email" type="email" placeholder="Email" class="border p-2 rounded w-full" />
    <input v-model="password" type="password" placeholder="Contraseña" class="border p-2 rounded w-full" />
    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded w-full">Iniciar sesión</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/useAuthStore'

const emit = defineEmits(['login-success'])

const email = ref('')
const password = ref('')
const authStore = useAuthStore()

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value)
    emit('login-success')
  } catch (e) {
    alert('Login fallido. Verificá tus credenciales.')
  }
}
</script>
