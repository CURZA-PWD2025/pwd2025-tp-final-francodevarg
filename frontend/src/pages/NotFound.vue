<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Home, AlertCircle } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

function goHome() {
  if(authStore.user?.tipo === 'admin') {
    router.push({ name: 'turnos-del-dia' })
  } else {
    router.push({ name: 'agendar-turno' })
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
    <div class="bg-slate-50 p-8 rounded-full mb-6 animate-bounce">
      <AlertCircle class="h-16 w-16 text-teal-500" />
    </div>
    
    <h1 class="text-6xl font-bold text-slate-900 mb-2">404</h1>
    <h2 class="text-2xl font-semibold text-slate-700 mb-4">Página no encontrada</h2>
    <p class="text-slate-500 max-w-md mb-8">
      Lo sentimos, la página que estás buscando no existe o ha sido movida.
    </p>

    <Button 
      @click="goHome" 
      class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-6 rounded-xl text-lg shadow-lg shadow-teal-200 transition-all hover:scale-105"
    >
      <Home class="mr-2 h-5 w-5" />
      Volver al inicio
    </Button>
  </div>
</template>