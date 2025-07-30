<script setup lang="ts">
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
  today
} from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'

import { ref } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const value = ref<DateValue>()

function isDateUnavailable(date: DateValue): boolean {
  const d = date.toDate(getLocalTimeZone())
  return !diasHabilitados.has(d.getDay())
}

const diasMap: Record<string, number> = {
  'Domingo': 0,
  'Lunes': 1,
  'Martes': 2,
  'Miércoles': 3,
  'Jueves': 4,
  'Viernes': 5,
  'Sábado': 6
}


import type { Horario } from '@/types/Veterinario'

const props = defineProps<{
  horarios: Horario[]
}>()

const diasHabilitados = new Set<number>(
  props.horarios.map(h => diasMap[h.dia_semana])
)

</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn(
          'w-[280px] justify-start text-left font-normal',
          !value && 'text-muted-foreground',
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ value ? df.format(value.toDate(getLocalTimeZone())) : "Seleccionar una Fecha" }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar 
        v-model="value" 
        initial-focus
        :min-value="today(getLocalTimeZone())"
        :is-date-unavailable="isDateUnavailable"
        />
    </PopoverContent>
  </Popover>
</template>