<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center gap-2 cursor-pointer">
          <StethoscopeIcon class="h-8 w-8 text-emerald-600" />
          <span class="text-xl font-bold text-gray-800">Veterinaria</span>
        </div>

        <div class="hidden md:flex items-center space-x-4">
          <MenuItems
            :is-admin="isAdmin"
            :current-page="currentPage"
            @navigate="navigate"
          />
          <UserMenu
            v-if="authStore.user"
            :is-admin="isAdmin"
            :user="authStore.user"
            @logout="logout"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { StethoscopeIcon } from 'lucide-vue-next'

import MenuItems from './MenuItems.vue'
import UserMenu from './UserMenu.vue'
import { useAuthStore } from '@/store/useAuthStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isAdmin = computed(() => authStore.user?.tipo === 'admin')
const currentPage = computed(() => String(route.name ?? 'appointments'))

function navigate(to: string) {
  console.log("to",to)
  router.push(to)
}

async function logout() {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>
