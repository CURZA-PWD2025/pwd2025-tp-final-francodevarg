<template>
    <div class="flex items-align-start justify-center pt-4">
      <AuthForm @success="onLoginSuccess" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import AuthForm from '@/components/auth/AuthForm.vue'
  import type { Usuario } from '@/types/Usuario'
  
  const router = useRouter()
  // redirigir según rol
  async function onLoginSuccess(user: Usuario | null): Promise<void> {
    if (user?.tipo === 'admin') {
      router.push({ name: 'turnos-del-dia' })
    } else {
      router.push({ name: 'agendar-turno' })
    }
  }
  </script>
  