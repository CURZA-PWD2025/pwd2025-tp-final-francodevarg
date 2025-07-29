<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { formSchema } from '@/schemas/veterinarioSchema'
import { diasSemana, type DiaSemana } from '@/constants/diasSemana'
import VeterinarioFormFields from './VeterinarioFormFields.vue'
import { Button } from '@/components/ui/button'
import type { Veterinario } from '@/types/Veterinario'
import { computed, onMounted } from 'vue'

const props = defineProps<{
  veterinario?: Veterinario | null
}>()

const emit = defineEmits(['submit', 'success'])

const isEditing = computed(() => !!props.veterinario?.id)

interface FormHorarioPayload {
  veterinario: {
    nombre: string
    especialidad: string
    email: string
    telefono: string
  },
  horarios: Partial<Record<DiaSemana, string[]>>
}

function filtrarDiasValidos(arr: string[]): DiaSemana[] {
  return arr.filter((d): d is DiaSemana => diasSemana.includes(d as DiaSemana))
}

const { handleSubmit, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: {
    nombre: '',
    especialidad: '',
    email: '',
    telefono: '',
    dias: [],
    horarios: [],
  },
})
import { filtrarHorariosValidos } from '@/utils'

onMounted(() => {
  if (props.veterinario) {
    const dias = filtrarDiasValidos(props.veterinario.horarios.map(h => h.dia_semana))

    const horarios = filtrarHorariosValidos(props.veterinario.horarios.map(h => h.hora))

    setValues({
      nombre: props.veterinario.nombre,
      especialidad: props.veterinario.especialidad,
      email: props.veterinario.email,
      telefono: props.veterinario.telefono,
      dias,
      horarios,
    })
  }
})

const onSubmit = handleSubmit(async (formValues) => {
  const payload: FormHorarioPayload = {
    veterinario: {
      nombre: formValues.nombre,
      especialidad: formValues.especialidad,
      email: formValues.email,
      telefono: formValues.telefono,
    },
    horarios: Object.fromEntries(
      formValues.dias.map(dia => [dia as DiaSemana, formValues.horarios])
    ),
  }

  try {
    const url = isEditing.value
      ? `http://localhost:5000/veterinarios/${props.veterinario!.id}`
      : 'http://localhost:5000/veterinarios/'

    const method = isEditing.value ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) throw new Error('Error al guardar')

    toast({
      title: isEditing.value ? 'Veterinario actualizado' : 'Veterinario creado con éxito',
    })

    emit('submit', payload)
    emit('success')
  } catch (e) {
    toast({
      title: 'Error',
      description: (e as Error).message,
    })
  }
})
</script>

<template>
  <form @submit="onSubmit" class="grid gap-6">
    <VeterinarioFormFields />
    <Button type="submit" class="w-full">
      {{ isEditing ? 'Actualizar Veterinario' : 'Guardar Veterinario' }}
    </Button>
  </form>
</template>
