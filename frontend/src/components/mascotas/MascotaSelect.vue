<template>
  <div class="space-y-4">
    <label for="mascota" class="block text-sm font-medium">
      Seleccioná una mascota
    </label>

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
            :value="String(m.id)"
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
  modelValue: number | null
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void
  (e: "mascotaSeleccionada", mascota: Mascota): void
}>()

const mascotaStore = useMascotaStore()
const mascotas = computed(() => mascotaStore.items)

const localValue = computed({
  // shadcn Select usa string, así que convertimos
  get: () => props.modelValue !== null ? String(props.modelValue) : "",
  set: (val: string) => {
    const numVal = val ? Number(val) : null
    emit("update:modelValue", numVal)

    const mascota = mascotaStore.items.find((m) => m.id === numVal)
    if (mascota) emit("mascotaSeleccionada", mascota)
  }
})
</script>
