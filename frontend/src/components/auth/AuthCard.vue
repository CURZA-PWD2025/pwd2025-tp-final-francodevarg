<template>
  <div class="mx-auto w-full max-w-md">
    <div class="login-card overflow-hidden rounded-xl border border-slate-200 shadow-md bg-white">
      <div class="px-5 py-5">
        <div class="mb-6 text-center">
          <h2 class="text-2xl font-bold text-slate-900 mb-2">{{ title }}</h2>
          <p class="text-sm text-slate-600">{{ subtitle }}</p>
        </div>

        <!-- Slot para el formulario -->
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>
