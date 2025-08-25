<template>
  <Navbar />
  <RouterView />
  <Toaster />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import {Navbar} from '@/components/navbar'
import { Toaster } from '@/components/ui/sonner'

import { onMounted } from 'vue'
import { useAuthStore } from '@/store/useAuthStore'
import { useAuthEffects } from '@/composables/useAuthEffects'

const auth = useAuthStore()

onMounted(() => {
  useAuthEffects()        // registra el watcher una vez
  auth.restoreSession()   // intenta restaurar sesión (token + me)
})
</script>
