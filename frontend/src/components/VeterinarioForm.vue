<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref, h } from 'vue'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'vue-sonner'

// Tipos para el payload
type DiaSemana =
  | 'Lunes'
  | 'Martes'
  | 'Miércoles'
  | 'Jueves'
  | 'Viernes'
  | 'Sábado'
  | 'Domingo'

interface FormHorarioPayload {
  veterinario: {
    nombre: string
    especialidad: string
    email: string
    telefono: string
  },
  horarios: Partial<Record<DiaSemana, string[]>>
}

const diasSemana = [
  { id: 'Lunes', label: 'Lunes' },
  { id: 'Martes', label: 'Martes' },
  { id: 'Miércoles', label: 'Miércoles' },
  { id: 'Jueves', label: 'Jueves' },
  { id: 'Viernes', label: 'Viernes' },
  { id: 'Sábado', label: 'Sábado' },
  { id: 'Domingo', label: 'Domingo' },
] as const

const horariosDisponibles = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '14:00', '15:00', '16:00', '17:00', '18:00'
] as const

const formSchema = toTypedSchema(z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  especialidad: z.string().min(1, 'La especialidad es obligatoria'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(1, 'El teléfono es obligatorio'),
  dias: z.array(z.string()).refine(arr => arr.length > 0, {
    message: 'Selecciona al menos un día',
  }),
  horarios: z.array(z.string()).refine(arr => arr.length > 0, {
    message: 'Selecciona al menos un horario',
  }),
}))

const { handleSubmit, values, defineField } = useForm({
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

const [nombreField] = defineField('nombre')
const [especialidadField] = defineField('especialidad')
const [emailField] = defineField('email')
const [telefonoField] = defineField('telefono')

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
    const res = await fetch('http://localhost:5000/veterinarios/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) throw new Error('Error al crear el veterinario')
    toast({ title: 'Veterinario creado con éxito' })
  } catch (e) {
    toast({ title: 'Error', description: (e as Error).message })
  }
})
</script>

<template>
  <form @submit="onSubmit" class="grid gap-6">
    <FormField name="nombre" v-slot="{ value, handleChange }">
      <FormItem>
        <FormLabel>Nombre</FormLabel>
        <FormControl>
          <Input :model-value="value" @update:model-value="handleChange" placeholder="Dr. Juan Pérez" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="especialidad" v-slot="{ value, handleChange }">
      <FormItem>
        <FormLabel>Especialidad</FormLabel>
        <FormControl>
          <Input :model-value="value" @update:model-value="handleChange" placeholder="Medicina General" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="email" v-slot="{ value, handleChange }">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input :model-value="value" @update:model-value="handleChange" placeholder="correo@ejemplo.com" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="telefono" v-slot="{ value, handleChange }">
      <FormItem>
        <FormLabel>Teléfono</FormLabel>
        <FormControl>
          <Input :model-value="value" @update:model-value="handleChange" placeholder="+54 11 1234-5678" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="dias">
      <FormItem>
        <FormLabel>Días de trabajo</FormLabel>
        <FormDescription>Selecciona al menos un día</FormDescription>
        <div class="grid grid-cols-3 gap-2">
          <FormField
            v-for="dia in diasSemana"
            v-slot="{ value, handleChange }"
            :key="dia.id"
            type="checkbox"
            :value="dia.id"
            :unchecked-value="false"
            name="dias"
          >
            <FormItem class="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  :model-value="value.includes(dia.id)"
                  @update:model-value="handleChange"
                />
              </FormControl>
              <FormLabel class="font-normal">
                {{ dia.label }}
              </FormLabel>
            </FormItem>
          </FormField>
        </div>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="horarios">
      <FormItem>
        <FormLabel>Horarios aplicados a todos los días</FormLabel>
        <FormDescription>Selecciona al menos un horario</FormDescription>
        <div class="grid grid-cols-2 gap-2">
          <FormField
            v-for="hora in horariosDisponibles"
            v-slot="{ value, handleChange }"
            :key="hora"
            type="checkbox"
            :value="hora"
            :unchecked-value="false"
            name="horarios"
          >
            <FormItem class="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  :model-value="value.includes(hora)"
                  @update:model-value="handleChange"
                />
              </FormControl>
              <FormLabel class="font-normal">
                {{ hora }}
              </FormLabel>
            </FormItem>
          </FormField>
        </div>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" class="w-full">
      Guardar Veterinario
    </Button>
  </form>
</template>
