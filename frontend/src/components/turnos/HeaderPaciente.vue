<template>
    <div class="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-4">
        <div class="titulo">
        <UserIcon class="icono" />
        <div>
          <h2 class="paso">Paso 2: Datos del Paciente</h2>
          <p class="descripcion">Ingresá la información del dueño de la mascota</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { UserIcon } from 'lucide-vue-next'
  </script>
  
  <style scoped>
  .header-paciente {
    background: linear-gradient(to right, #00c853, #00bfa5);
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
  