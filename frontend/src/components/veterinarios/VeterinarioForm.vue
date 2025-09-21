<script setup lang="ts">
import { watch, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { formSchema } from '@/schemas/veterinarioSchema'
import { diasSemana, type DiaSemana, type Hora } from '@/constants/diasSemana'
import VeterinarioFormFields from './VeterinarioFormFields.vue'
import { Button } from '@/components/ui/button'
import type { Veterinario } from '@/types/Veterinario'
import VeterinarioService from '@/services/VeterinarioService'

const props = defineProps<{ veterinario?: Veterinario | null }>()
const emit = defineEmits(['submit','success'])
const isEditing = computed(() => !!props.veterinario?.id)

interface FormHorarioPayload {
  veterinario: { nombre: string; especialidad: string; email: string; telefono: string },
  horarios: Partial<Record<DiaSemana, string[]>>
}

// --- helpers ---
const normBasic = (s: string) => (s ?? '').trim().toLowerCase()
const matchDia = (dia: string): DiaSemana | null => {
  const n = normBasic(dia)
  const found = diasSemana.find(d => normBasic(d) === n)
  return (found as DiaSemana) ?? null
}


const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: {
    nombre: '',
    especialidad: '',
    email: '',
    telefono: '',
    dias: [] as DiaSemana[],
    horarios: [] as Hora[],
  },
})

watch(
  () => props.veterinario,
  (vet) => {
    if (!vet) {
      resetForm({ values: { nombre:'', especialidad:'', email:'', telefono:'', dias:[], horarios:[] } })
      return
    }

    // DEDUP: un solo día y una sola vez cada horario
    const diasSet = new Set<DiaSemana>()
    const horasSet = new Set<Hora>()

    for (const h of (vet.horarios ?? [])) {
      const d = matchDia(h.dia_semana)
      if (d) diasSet.add(d)
      horasSet.add(h.hora)
    }

    resetForm({
      values: {
        nombre: vet.nombre ?? '',
        especialidad: vet.especialidad ?? '',
        email: vet.email ?? '',
        telefono: vet.telefono ?? '',
        dias: Array.from(diasSet),
        horarios: Array.from(horasSet),
      }
    })
  },
  { immediate: true }
)

const onSubmit = handleSubmit(async (formValues) => {
  const payload: FormHorarioPayload = {
    veterinario: {
      nombre: formValues.nombre,
      especialidad: formValues.especialidad,
      email: formValues.email,
      telefono: formValues.telefono,
    },
    horarios: Object.fromEntries(
      (formValues.dias as DiaSemana[]).map(d => [d, (formValues.horarios as string[]).map(h => h.trim())])
    ),
  }

  try {
    if (isEditing.value) {
      await VeterinarioService.update(props.veterinario!.id, payload as any)
      toast({ title: 'Veterinario actualizado' })
    } else {
      await VeterinarioService.create(payload as any)
      toast({ title: 'Veterinario creado con éxito' })
    }
    emit('submit', payload); emit('success')
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || 'Error al guardar'
    toast({ title: 'Error', description: msg })
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="grid gap-6">
    <VeterinarioFormFields />
    <Button type="submit" class="w-full" :disabled="isSubmitting">
      <template v-if="isSubmitting">Guardando...</template>
      <template v-else>{{ isEditing ? 'Actualizar Veterinario' : 'Guardar Veterinario' }}</template>
    </Button>
  </form>
</template>
