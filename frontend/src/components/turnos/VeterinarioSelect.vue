<template>
  <FormField name="veterinario_id" v-slot="{ componentField }">
    <FormItem>
      <FormLabel>Veterinario *</FormLabel>
      <FormControl>
        <Select
          v-bind="componentField"
          :disabled="loading || veterinarios.length === 0"
          @update:modelValue="onUpdateModelValue"
          >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un veterinario" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="vet in veterinarios"
              :key="vet.id"
              :value="vet.id.toString()"
            >
              {{ vet.nombre }} ({{ vet.especialidad }})
            </SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl
} from '@/components/ui/form'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'

import { onMounted, computed } from 'vue'
import { useVeterinarioStore } from '@/store/useVeterinarioStore'
import type { Veterinario } from '@/types/Veterinario'

const store = useVeterinarioStore()
const veterinarios = computed<Veterinario[]>(() => store.veterinarios)
const loading = computed<boolean>(() => store.loading)

onMounted(() => {
  if (veterinarios.value.length === 0) {
    store.fetchVeterinarios()
  }
})

const emit = defineEmits<{
  (e: 'seleccionar', id: number | null): void
}>()


function onUpdateModelValue(value: unknown) {
  const id = typeof value === 'string' ? parseInt(value) : null
  emit('seleccionar', id)
}

</script>
