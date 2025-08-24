<template>
    <RouterLink
      to="/perfil"
      class="flex items-center gap-2 px-3 py-1.5 rounded-md border shadow-sm transition-colors hover:brightness-95"
      :class="isAdmin
        ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
        : 'bg-sky-100 border-sky-300 text-sky-800'"
    >
      <UserIcon class="h-4 w-4" />
      <span class="text-sm font-semibold">{{ user?.nombre }}</span>
      <Badge
        :variant="isAdmin ? 'default' : 'secondary'"
        class="text-xs"
      >
        {{ isAdmin ? 'Admin' : 'Cliente' }}
      </Badge>
    </RouterLink>
  
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" @click="$emit('logout')" class="cursor-pointer">
                <LogOutIcon class="h-4 w-4" />
            </Button>
            </TooltipTrigger>
            <TooltipContent>
            <p>Cerrar sesión</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>

  </template>
  
  <script setup lang="ts">
  import { LogOutIcon, UserIcon } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  import { Badge } from '@/components/ui/badge'
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from '@/components/ui/tooltip'
  import type { User } from '@/types/Auth';
  
  defineProps<{
    isAdmin: boolean
    user: User 
  }>()
  </script>
  