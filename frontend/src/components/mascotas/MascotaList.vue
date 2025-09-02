<script setup lang="ts">
import { onMounted, watch } from "vue"
import { useMascotaStore } from "@/store/useMascotaStore"
import MascotaCard from "./MascotaCard.vue"
import type { Mascota } from "@/types/Mascota";

const props = defineProps<{ userId: number }>()

const store = useMascotaStore()

const emit = defineEmits<{
  (e: "edit", id: number): void
  (e: "delete", mascota:Mascota): void
}>()

onMounted(() => {
  store.fetchByUserId(props.userId)
})

watch(
  () => props.userId,
  (id) => {
    if (id) store.fetchByUserId(id)
  }
)
</script>

<template>
  <div>
    <div v-if="store.loading" class="text-slate-500">Cargando mascotas...</div>
    <div v-else-if="!store.items.length" class="text-slate-600 italic">
      No tenés mascotas registradas.
    </div>
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <MascotaCard
        v-for="m in store.items"
        :key="m.id"
        :mascota="m"
        @edit="emit('edit', m.id!)"
        @delete="emit('delete', m)"
      />
    </div>
  </div>
</template>
