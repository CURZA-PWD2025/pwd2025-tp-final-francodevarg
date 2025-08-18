<template>
    <div class="form-group" v-if="horarios.length">
      <label>Horarios disponibles</label>
      <div class="horarios-grid">
        <button
          v-for="horarioItem in horarios"
          :key="horarioItem.hora"
          type="button"
          class="hora-btn"
          :class="{
            disponible: horarioItem.disponible,
            seleccionado: modelValue === horarioItem.hora,
            deshabilitado: !horarioItem.disponible,
          }"
          :disabled="!horarioItem.disponible"
          @click="$emit('update:modelValue', horarioItem.hora)"
        >
          {{ horarioItem.hora }}
        </button>
      </div>
      <span class="error" v-if="error">{{ error }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    modelValue: string | undefined
    horarios: { hora: string; disponible: boolean }[]
    error?: string
  }>()
  defineEmits(['update:modelValue'])
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

    .horarios-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
    }

    .hora-btn {
    padding: 6px 12px;
    font-size: 14px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    }

    .hora-btn.disponible {
    background-color: #e0f7e9;
    }

    .hora-btn.seleccionado {
    background-color: #4caf50;
    color: white;
    }

    .hora-btn.deshabilitado {
    background-color: #f0f0f0;
    color: #aaa;
    cursor: not-allowed;
    }

    .error {
    color: red;
    font-size: 13px;
    margin-top: 4px;
    }

  </style>