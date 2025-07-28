<template>
  <Navbar />
  <RouterView />
  <Toaster />
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import { Toaster } from '@/components/ui/sonner'
</script>
