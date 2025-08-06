<template>
    <template v-for="item in menuItems" :key="item.id">
      <Button
        :variant="currentPage === item.id ? 'default' : 'ghost'"
        @click="$emit('navigate', item)"
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
    SettingsIcon
  } from 'lucide-vue-next'
  import menuConfig from './menuConfig.json'
  
  const props = defineProps<{
    isAdmin: boolean
    currentPage: string
  }>()
  
  const icons = {
    CalendarIcon,
    UsersIcon,
    SettingsIcon
  }
  
  const menuItems = computed(() => props.isAdmin ? menuConfig.admin : menuConfig.client)
  </script>
  