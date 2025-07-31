<template>
    <div class="form-group">
      <label for="fecha">Fecha</label>
      <input type="date" id="fecha" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
      <span class="error" v-if="error">{{ error }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    modelValue: string
    error?: string
  }>()
  </script>
  
  <style scoped>
   .form-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    }

    label {
    font-weight: bold;
    margin-bottom: 6px;
    }

    input[type="date"] {
    padding: 8px;
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid #ccc;
    }

    .error {
    color: red;
    font-size: 13px;
    margin-top: 4px;
    }
   </style>