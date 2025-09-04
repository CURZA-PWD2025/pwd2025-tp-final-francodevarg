<template>
  <div class="min-h-[calc(100vh-64px)] bg-gradient-to-b from-emerald-50/60 via-white to-white">
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-emerald-700 flex items-center gap-2">
        <PawPrint class="w-6 h-6 text-emerald-600" />
        Mis Mascotas
      </h1>
      <Button class="bg-emerald-600 hover:bg-emerald-700 text-white gap-2" @click="openCreate">
        <Plus class="w-4 h-4" /> Nueva Mascota
      </Button>
    </header>

    <MascotaList :userId="userId" @edit="openEdit" @delete="toDeleteMascota = $event" />

    <MascotaFormModal
      :open="showForm"
      :modelo="editModel"
      @close="showForm = false"
      @saved="handleSaved"
    />

    <AlertDialog :open="toDeleteMascota !== null" >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar {{ toDeleteMascota?.nombre }}</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. ¿Seguro que querés eliminar esta mascota?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="toDeleteMascota = null">Cancelar</AlertDialogCancel>
          <AlertDialogAction class="bg-red-600 hover:bg-red-700" @click="confirmDelete">
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useMascotaStore } from "@/store/useMascotaStore"
import MascotaList from "@/components/mascotas/MascotaList.vue"
import MascotaFormModal from "@/components/mascotas/MascotaFormModal.vue"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { PawPrint, Plus } from "lucide-vue-next"
import type { Mascota } from "@/types/Mascota"
import { useAuthStore } from "@/store/useAuthStore"

const store = useMascotaStore()
const authStore = useAuthStore()
// userId vendría del authStore o del backend
const userId = authStore.user!.id

const showForm = ref(false)
const editModel = ref<Mascota | null>(null)
const toDeleteMascota = ref<Mascota | null>(null)

function openCreate() {
  editModel.value = null
  showForm.value = true
}

function openEdit(id: number) {
  const mascota = store.items.find(m => m.id === id)
  console.log("edit:", mascota)
  if (mascota) {
    editModel.value = mascota
    showForm.value = true
  }
}
async function handleSaved(mascota: Mascota) {
  if (mascota.id) {
    const updated = await store.updateOne(mascota.id, {
      id: mascota.id,
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza,
      edad: mascota.edad,
      usuario_id: mascota.usuario_id, 

    })
    console.log("updated",updated)
  } else {
    const created = await store.createOne({
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza,
      edad: mascota.edad,
      usuario_id: mascota.usuario_id, 
    })
    console.log("created",created)

  }
  showForm.value = false
}

async function confirmDelete() {
  if (toDeleteMascota.value) {
    await store.removeOne(toDeleteMascota.value.id!)
    toDeleteMascota.value = null
  }
}
</script>
