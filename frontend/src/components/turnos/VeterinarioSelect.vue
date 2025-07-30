<template>
  <FormField name="veterinario_id" v-slot="{ componentField }">
    <FormItem>
      <FormLabel>Veterinario *</FormLabel>
      <FormControl>
        <Select
          v-bind="componentField"
          :disabled="loading || veterinarios.length === 0"
          @update:modelValue="(id) => $emit('seleccionar', id)"
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

const emit = defineEmits<{
  (e: 'seleccionar', id: any | null): void
}>()

const store = useVeterinarioStore()

const veterinarios = computed(() => store.veterinarios)
const loading = computed(() => store.loading)

onMounted(() => {
  if (store.veterinarios.length === 0) {
    store.fetchVeterinarios()
  }
})
</script>
