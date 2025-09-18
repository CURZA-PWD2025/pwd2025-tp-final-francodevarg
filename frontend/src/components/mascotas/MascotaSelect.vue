<template>
  <div class="space-y-4">
    <label for="mascota" class="block text-sm font-medium">Seleccioná una mascota</label>
    <Select v-model="localValue">
      <SelectTrigger class="w-full">
        <SelectValue placeholder="-- Elegí una mascota --" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Mascotas</SelectLabel>
          <SelectItem
            v-for="m in mascotas"
            :key="m.id"
            :value="m.id"
          >
            {{ m.nombre }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useMascotaStore } from "@/store/useMascotaStore"
import type { Mascota } from "@/types/Mascota"

// Importar los componentes de shadcn-vue
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select"

const props = defineProps<{
  modelValue: number | ""
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: number | ""): void
  (e: "mascotaSeleccionada", mascota: Mascota): void
}>()

const mascotaStore = useMascotaStore()
const mascotas = computed(() => mascotaStore.items)

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit("update:modelValue", val)
    const mascota = mascotaStore.items.find((m) => m.id === val)
    if (mascota) emit("mascotaSeleccionada", mascota)
  },
})
</script>
