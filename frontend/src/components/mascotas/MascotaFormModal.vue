<script setup lang="ts">
import { watch, ref } from "vue"
import { useForm, useField } from "vee-validate"
import { z } from "zod"
import { toTypedSchema } from "@vee-validate/zod"
import type { Mascota } from "@/types/Mascota"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Dog, Save, X } from "lucide-vue-next"
import { useAuthStore } from "@/store/useAuthStore"

const props = defineProps<{
  open: boolean
  modelo?: Mascota | null
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "saved", value: Mascota): void
}>()

// === Validación con Zod ===
const schema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  especie: z.enum(["Perro", "Gato", "Otro"], { required_error: "Seleccioná especie" }),
  raza: z.string().min(1, "Debe indicar la raza"),
  edad: z.coerce.number().int().min(0, "La edad no puede ser negativa"),
})

type FormValues = z.infer<typeof schema>

// === Configuración del form ===
const { handleSubmit, resetForm } = useForm<FormValues>({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    nombre: props.modelo?.nombre ?? "",
    especie: (props.modelo?.especie as FormValues["especie"]) ?? "Perro",
    raza: props.modelo?.raza ?? "",
    edad: props.modelo?.edad ?? 0,
  },
})

const { value: nombre, errorMessage: nombreErr } = useField<string>("nombre")
const { value: especie, errorMessage: especieErr } = useField<FormValues["especie"]>("especie")
const { value: raza, errorMessage: razaErr } = useField<string>("raza")
const { value: edad, errorMessage: edadErr } = useField<number>("edad")

// Resetear cuando cambie el modelo
watch(
  () => props.modelo,
  (m) => {
    resetForm({
      values: {
        nombre: m?.nombre ?? "",
        especie: (m?.especie as FormValues["especie"]) ?? "Perro",
        raza: m?.raza ?? "",
        edad: m?.edad ?? 0,
      },
    })
  }
)

const saving = ref(false)

const onSubmit = handleSubmit(async (values) => {
  const authStore = useAuthStore()
  saving.value = true
  try {
    if (props.modelo?.id) {
      // === Editando ===
      emit("saved", {
        id: props.modelo.id,
        ...values,
                usuario_id: authStore.user!.id,

      } as Mascota)
    } else {
      // === Creando ===
      emit("saved", {
        ...values,
        usuario_id: authStore.user!.id,
      } as Mascota)
    }
  } finally {
    saving.value = false
  }
})

</script>

<template>
  <Dialog :open="open" @update:open="emit('close')">
    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2 text-emerald-800">
          <Dog class="w-5 h-5 text-emerald-600" />
          {{ props.modelo?.id ? "Editar Mascota" : "Nueva Mascota" }}
        </DialogTitle>
      </DialogHeader>

      <form class="space-y-5" @submit.prevent="onSubmit">
        <!-- Nombre -->
        <div>
          <Label for="nombre">Nombre</Label>
          <Input id="nombre" v-model="nombre" placeholder="Ej: Luna" autocomplete="off" />
          <p v-if="nombreErr" class="form-error">{{ nombreErr }}</p>
        </div>

        <!-- Especie -->
        <div>
          <Label for="especie">Especie</Label>
          <Select v-model="especie">
            <SelectTrigger id="especie">
              <SelectValue placeholder="Seleccioná especie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Perro">Perro</SelectItem>
              <SelectItem value="Gato">Gato</SelectItem>
              <SelectItem value="Otro">Otro</SelectItem>
            </SelectContent>
          </Select>
          <p v-if="especieErr" class="form-error">{{ especieErr }}</p>
        </div>

        <!-- Raza -->
        <div>
          <Label for="raza">Raza</Label>
          <Input id="raza" v-model="raza" placeholder="Ej: Labrador" autocomplete="off" />
          <p v-if="razaErr" class="form-error">{{ razaErr }}</p>
        </div>

        <!-- Edad -->
        <div>
          <Label for="edad">Edad (años)</Label>
          <Input id="edad" type="number" min="0" step="1" v-model="edad" autocomplete="off" />
          <p v-if="edadErr" class="form-error">{{ edadErr }}</p>
        </div>

        <!-- Acciones -->
        <DialogFooter class="pt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" class="gap-2" @click="emit('close')">
            <X class="w-4 h-4" /> Cancelar
          </Button>
          <Button
            type="submit"
            class="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            :disabled="saving"
          >
            <Save class="w-4 h-4" />
            {{ props.modelo?.id ? "Actualizar" : "Guardar" }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.form-error {
  font-size: 13px;
  color: #b91c1c; /* red-700 */
  margin-top: 4px;
}
</style>
