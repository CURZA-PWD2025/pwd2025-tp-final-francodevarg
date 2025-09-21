<template>
  <section class="mx-auto max-w-5xl px-6 py-8 min-h-screen">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold flex items-center gap-2">
          <UsersIcon class="w-6 h-6 text-emerald-600" />
          Administrar Veterinarios
        </h2>
        <p class="text-muted-foreground">Gestiona los profesionales y sus horarios.</p>
      </div>

      <Dialog v-model:open="isDialogOpen">
        <DialogTrigger as-child>
          <Button  @click="crearVeterinario" class="bg-emerald-600 hover:bg-emerald-700 text-white">
            + Agregar Veterinario
          </Button>
        </DialogTrigger>
        <DialogContent class="max-w-3xl">
          <DialogTitle class="text-lg font-medium">
          {{ selectedVeterinario ? 'Editar Veterinario' : 'Nuevo Veterinario' }}
          </DialogTitle>
          <DialogDescription>
            Completa el formulario para {{ selectedVeterinario ? 'editar' : 'agregar' }} un veterinario y sus horarios.
          </DialogDescription>
        <VeterinarioForm
          :veterinario="selectedVeterinario"
          @success="onFormSuccess"
        />

        </DialogContent>
      </Dialog>
    </div>

    <div class="grid gap-6">
      <VeterinarioCard
        v-for="(vet, i) in veterinarios"
        :key="i"
        :veterinario="vet"
        @editar="editarVeterinario"
        @eliminar="eliminarVeterniario"
        />

    </div>
  </section>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@/components/ui/dialog'
import { UsersIcon } from 'lucide-vue-next'
import VeterinarioForm from '@/components/veterinarios/VeterinarioForm.vue'
import VeterinarioCard from '@/components/veterinarios/VeterinarioCard.vue'
import type { Veterinario } from '@/types/Veterinario'
import VeterinarioService from '@/services/VeterinarioService'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'

const veterinarios = ref<Veterinario[]>([])
const isDialogOpen = ref(false)
const selectedVeterinario = ref<Veterinario | null>(null)

async function fetchVeterinarios() {
  try {
    const response = await VeterinarioService.getAll();
    veterinarios.value = response.data
  } catch (error) {
    console.error('Error al cargar veterinarios:', error)
  }
}


onMounted(() => {
  fetchVeterinarios()
})


function crearVeterinario() {
  selectedVeterinario.value = null
  isDialogOpen.value = true
}

function editarVeterinario(vet: Veterinario) {
  selectedVeterinario.value = vet
  isDialogOpen.value = true
}

async function eliminarVeterniario(vet: Veterinario) {
  if (!confirm(`¿Estás seguro de eliminar al veterinario ${vet.nombre}? Esta acción no se puede deshacer.`)) {
    return
  }
  try {
    await VeterinarioService.destroy(vet.id)
    // toast({ title: 'Veterinario eliminado' })
    confirm("Veterinario eliminado")
    fetchVeterinarios()
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || 'Error al eliminar'
    console.log("error",msg)
  }
}


function onFormSuccess() {
  isDialogOpen.value = false
  selectedVeterinario.value = null
  fetchVeterinarios()
}

</script>
