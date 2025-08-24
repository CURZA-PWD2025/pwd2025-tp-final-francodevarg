<template>
    <div class="min-h-screen flex items-center justify-center bg-slate-50">
      <LoginForm @success="onLoginSuccess" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import LoginForm from '@/components/auth/LoginForm.vue'
  import { useAuthStore } from '@/store/useAuthStore'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  async function onLoginSuccess(user: unknown) {
    console.log('✅ Sesión iniciada:', user)
  
    // redirigir según rol
    if (authStore.user?.tipo === 'admin') {
      router.push({ name: 'admin' })
    } else {
      router.push({ name: 'appointments' })
    }
  }
  </script>
  