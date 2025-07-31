<template>
    <div class="form-group">
      <label for="veterinario_id">Veterinario</label>
      <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)" id="veterinario_id">
        <option value="">Selecciona un veterinario</option>
        <option v-for="vet in veterinarios" :key="vet.id" :value="vet.id.toString()">
          {{ vet.nombre }} - {{ vet.especialidad }}
        </option>
      </select>
      <span class="error" v-if="error">{{ error }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    modelValue: string
    error?: string
    veterinarios: { id: number; nombre: string; especialidad: string }[]
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

    select {
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