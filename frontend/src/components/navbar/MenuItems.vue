<template>
    <template v-for="item in menuItems" :key="item.id">
      <Button
        :variant="currentPage === item.id ? 'default' : 'ghost'"
        @click="go(item.route)"
        :class="[
          'flex items-center gap-2 cursor-pointer',
          currentPage === item.id
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        ]"
      >
        <component :is="icons[item.icon]" class="h-4 w-4" />
        {{ item.label }}
      </Button>
    </template>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { Button } from '@/components/ui/button'
  import {
    CalendarIcon,
    UsersIcon,
    SettingsIcon,
    Dog
  } from 'lucide-vue-next'
  import menuConfig from './menuConfig.json'
import { useAuthStore } from '@/store/useAuthStore';
  
  const props = defineProps<{
    currentPage: string
  }>()


  const authStore = useAuthStore()

  const emit = defineEmits<{
    (e: 'navigate', to: string): void
  }>()

  function go(to: string) {
   emit('navigate', to)
  }
  const icons:any = {
    CalendarIcon,
    UsersIcon,
    SettingsIcon,
    Dog
  }

  const menuItems = computed(() => {
  if (!authStore.user) return menuConfig.public
  return authStore.user.tipo === 'admin'
    ? menuConfig.admin
    : menuConfig.client
})
</script>
  