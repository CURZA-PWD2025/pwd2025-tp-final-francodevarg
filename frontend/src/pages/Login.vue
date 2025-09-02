<template>
    <div class="flex items-align-start justify-center pt-4">
      <LoginForm @success="onLoginSuccess" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import LoginForm from '@/components/auth/LoginForm.vue'
  import { useAuthStore } from '@/store/useAuthStore'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  async function onLoginSuccess() {
  
    // redirigir según rol
    if (authStore.user?.tipo === 'admin') {
      router.push({ name: 'turnos-del-dia' })
    } else {
      router.push({ name: 'agendar-turno' })
    }
  }
  </script>
  