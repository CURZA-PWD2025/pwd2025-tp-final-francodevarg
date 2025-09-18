<template>
  <Navbar />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import {Navbar} from '@/components/navbar'

import { onMounted } from 'vue'
import { useAuthStore } from '@/store/useAuthStore'
import { useAuthEffects } from '@/composables/useAuthEffects'

const auth = useAuthStore()

onMounted(() => {
  useAuthEffects()        // registra el watcher una vez
  auth.restoreSession()   // intenta restaurar sesión (token + me)
})
</script>
