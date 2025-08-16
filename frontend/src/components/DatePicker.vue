<script setup lang="ts">
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
  today
} from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'

import { defineModel } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const value = defineModel<DateValue | undefined>()

function isDateUnavailable(date: DateValue): boolean {
  const d = date.toDate(getLocalTimeZone())
  return !props.diasHabilitados.includes(d.getDay())
}

const props = defineProps<{
  diasHabilitados: number[]
}>()

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