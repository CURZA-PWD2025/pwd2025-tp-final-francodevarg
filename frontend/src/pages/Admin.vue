<template>
  <section class="px-6 py-8 bg-muted/30 min-h-screen">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold flex items-center gap-2">
          <UsersIcon class="w-6 h-6 text-emerald-600" />
          Administrar Veterinarios
        </h2>
        <p class="text-muted-foreground">Gestiona los profesionales, sus horarios y servicios</p>
      </div>

      <Dialog>
        <DialogTrigger as-child>
          <Button class="bg-emerald-600 hover:bg-emerald-700 text-white">
            + Agregar Veterinario
          </Button>
        </DialogTrigger>
        <DialogContent class="max-w-3xl">
          <VeterinarioForm @submit="agregarVeterinario" />
        </DialogContent>
      </Dialog>
    </div>

    <div class="grid gap-6">
      <VeterinarioCard
        v-for="(vet, i) in veterinarios"
        :key="i"
        :nombre="vet.nombre"
        :especialidad="vet.especialidad"
        :email="vet.email"
        :telefono="vet.telefono"
        :dias="vet.dias"
        :horarios="vet.horarios"
      />
    </div>
  </section>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

import { Button } from '@/components/ui/button'
import VeterinarioForm from '@/components/VeterinarioForm.vue'
import VeterinarioCard from '@/components/VeterinarioCard.vue'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@/components/ui/dialog'
import { UsersIcon } from 'lucide-vue-next'

const veterinarios = ref<any[]>([])

async function fetchVeterinarios() {
  try {
    const response = await axios.get('http://localhost:5000/veterinarios')
    veterinarios.value = response.data
  } catch (error) {
    console.error('Error al cargar veterinarios:', error)
  }
}

function agregarVeterinario(data: any) {
  veterinarios.value.push(data)
}

onMounted(() => {
  fetchVeterinarios()
})
</script>
