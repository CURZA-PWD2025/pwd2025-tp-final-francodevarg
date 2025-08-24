<template>
    <div class="space-y-4">
      <label for="mascota">Selecciona una mascota</label>
      <select
        v-model="localValue"
        id="mascota"
        class="border rounded p-2 w-full"
      >
        <option disabled value="">-- Elegí una mascota --</option>
        <option
          v-for="m in mascotas"
          :key="m.id"
          :value="m.id"
        >
          {{ m.nombre }}
        </option>
      </select>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from "vue"
  import { useMascotaStore } from "@/store/useMascotaStore"
  
  const props = defineProps<{
    modelValue: number | ""
  }>()
  
  const emit = defineEmits<{
    (e: "update:modelValue", value: number | ""): void
  }>()
  
  const mascotaStore = useMascotaStore()
  const mascotas = computed(() => mascotaStore.mascotas)
  
  // Proxy local para compatibilidad con v-model
  const localValue = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
  })
  </script>