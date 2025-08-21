<script setup lang="ts">
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
  today
} from '@internationalized/date'
import { defineModel } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-vue-next'

const model = defineModel<DateValue | undefined>()

const props = defineProps<{
  diasHabilitados: number[]
  error?: string
}>()

const emit = defineEmits<{ (e: 'blur'): void }>()

const df = new DateFormatter('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

function isDateUnavailable(date: DateValue): boolean {
  const d = date.toDate(getLocalTimeZone())
  return !props.diasHabilitados.includes(d.getDay())
}

function onSelect(date: DateValue) {
  model.value = date
  emit('blur') // para vee-validate: marca el campo como touched
}
</script>

<template>
  <div>
    <Popover>
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          :class="cn(
            'w-[280px] justify-start text-left font-normal',
            !model && 'text-muted-foreground'
          )"
        >
          <CalendarIcon class="mr-2 h-4 w-4" />
          {{ model ? df.format(model.toDate(getLocalTimeZone())) : "Seleccionar una Fecha" }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <Calendar
          v-model="model"
          initial-focus
          :min-value="today(getLocalTimeZone())"
          :is-date-unavailable="isDateUnavailable"
          @update:selected="onSelect"
        />
      </PopoverContent>
    </Popover>
    <p v-if="props.error" class="text-sm text-red-500 mt-1">{{ props.error }}</p>
  </div>
</template>
