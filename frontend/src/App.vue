<template>
  <Navbar />
  <RouterView />
  <Toaster />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import {Navbar} from '@/components/navbar'
import { Toaster } from '@/components/ui/sonner'
</script>
