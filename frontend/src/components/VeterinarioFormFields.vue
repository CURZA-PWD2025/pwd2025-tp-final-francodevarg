<script setup lang="ts">
import { diasSemana, horariosDisponibles } from '@/constants/diasSemana'

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
</script>

<template>
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
          :key="dia"
          type="checkbox"
          :value="dia"
          :unchecked-value="false"
          name="dias"
        >
          <FormItem class="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                :model-value="value.includes(dia)"
                @update:model-value="handleChange"
              />
            </FormControl>
            <FormLabel class="font-normal">
              {{ dia }}
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
</template>
