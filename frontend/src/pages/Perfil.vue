<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'
import { LogOut, User, Mail, Shield } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.getUser)

const initials = computed(() => {
  if (!user.value?.nombre) return 'U'
  return user.value.nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const roleLabel = computed(() => {
  if (user.value?.tipo === 'admin') return 'Administrador'
  if (user.value?.tipo === 'cliente') return 'Cliente'
  return user.value?.tipo || 'Usuario'
})

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'iniciar-sesion' })
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <!-- Header Background -->
      <div class="h-32 bg-gradient-to-r from-teal-500 to-emerald-600 relative">
        <div class="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <div class="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
            <div class="h-full w-full rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-teal-700">
              {{ initials }}
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="pt-16 pb-8 px-8 text-center">
        <h1 class="text-2xl font-bold text-slate-800 mb-1">{{ user?.nombre }}</h1>
        <p class="text-slate-500 text-sm mb-6">{{ user?.email }}</p>

        <div class="space-y-4 text-left">
          <div class="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div class="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 mr-4">
              <User class="h-5 w-5" />
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">Nombre</p>
              <p class="text-slate-700 font-medium">{{ user?.nombre }}</p>
            </div>
          </div>

          <div class="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div class="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 mr-4">
              <Mail class="h-5 w-5" />
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">Email</p>
              <p class="text-slate-700 font-medium">{{ user?.email }}</p>
            </div>
          </div>

          <div class="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div class="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 mr-4">
              <Shield class="h-5 w-5" />
            </div>
            <div>
              <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">Rol</p>
              <p class="text-slate-700 font-medium">{{ roleLabel }}</p>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-slate-100">
          <Button 
            variant="destructive" 
            class="w-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-none shadow-none"
            @click="handleLogout"
          >
            <LogOut class="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>