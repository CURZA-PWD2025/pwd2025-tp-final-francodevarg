<template>
  <div class="space-y-1.5">
    <Label :for="id" class="login-label">{{ label }}</Label>
    <Input
      :id="id"
      v-model="value"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      class="login-input"
      :class="{ 'login-input--error': errorMessage }"
      :autocomplete="autocomplete"
    />
    <p v-if="errorMessage" class="login-error-msg">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const props = defineProps<{
  id: string
  name: string 
  label: string
  type: string
  placeholder?: string
  disabled?: boolean
  autocomplete?: string
}>()

const { value, errorMessage } = useField<string>(() => props.name)
</script>

