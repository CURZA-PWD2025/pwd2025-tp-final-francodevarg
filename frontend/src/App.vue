<template>
  <Navbar />
  <div class="min-h-[calc(100vh-64px)] bg-gradient-to-b from-emerald-50/60 via-white to-white">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import {Navbar} from '@/components/navbar'

</script>
