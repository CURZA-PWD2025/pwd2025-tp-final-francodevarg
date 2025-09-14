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
    <p class="login-error-msg">
        <span v-if="errorMessage">
            {{ errorMessage }}
        </span>
    </p>
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

<style scoped>
.login-error-msg {
  height: 1rem;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500; 
  margin-top: 0.25rem;
}
</style>

