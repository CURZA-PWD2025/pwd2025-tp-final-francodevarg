<template>
  <div class="space-y-4">
    <label for="mascota">Seleccioná una mascota</label>
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
import type { Mascota } from "@/types/Mascota" // Asegurate de tener este tipo

const props = defineProps<{
  modelValue: number | ""
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: number | ""): void
  (e: "mascotaSeleccionada", mascota: Mascota): void
}>()

const mascotaStore = useMascotaStore()
const mascotas = computed(() => mascotaStore.mascotas)

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit("update:modelValue", val)
    const mascota = mascotaStore.mascotas.find((m) => m.id === val)
    if (mascota) emit("mascotaSeleccionada", mascota)
  },
})
</script>
