<template>
    <header class="flex items-center justify-between px-6 py-4 border-b border-border bg-background text-foreground">
      <!-- Logo -->
      <div class="flex items-center gap-2 font-semibold text-xl">
        <StethoscopeIcon class="w-6 h-6 text-emerald-600" />
        <span>Veterinaria San Martín</span>
      </div>
  
      <!-- Navegación -->
      <nav class="flex items-center gap-6">
        <RouterLink to="/agendar">
          <Button class="bg-emerald-500 text-white hover:bg-emerald-600">
            <CalendarIcon class="w-4 h-4 mr-2" />
            Agendar Turno
          </Button>
        </RouterLink>
  
        <RouterLink
          to="/turnos"
          class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <UsersIcon class="w-5 h-5" />
          Turnos del Día
        </RouterLink>
  
        <RouterLink
          to="/admin"
          class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <SettingsIcon class="w-5 h-5" />
          Administrar
        </RouterLink>
      </nav>
    </header>
  </template>
  
  <script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import {
    CalendarIcon,
    SettingsIcon,
    UsersIcon,
    StethoscopeIcon,
  } from 'lucide-vue-next'
  import { Button } from '@/components/ui/button'
  </script>
  