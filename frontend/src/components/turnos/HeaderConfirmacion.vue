<template>
    <div class="header-confirmacion">
      <div class="titulo">
        <CheckCircleIcon class="icono" />
        <div>
          <h2 class="paso">Paso 3: Confirmación</h2>
          <p class="descripcion">Verificá los datos antes de agendar el turno</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { CheckCircleIcon } from 'lucide-vue-next'
  </script>
  
  <style scoped>
  .header-confirmacion {
    background: linear-gradient(to right, #1e88e5, #42a5f5);
    color: white;
    padding: 16px 24px;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  }
  
  .titulo {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .icono {
    width: 24px;
    height: 24px;
  }
  
  .paso {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
  
  .descripcion {
    font-size: 14px;
    opacity: 0.9;
    margin: 0;
  }
  </style>
  