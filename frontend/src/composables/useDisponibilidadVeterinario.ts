import { ref, computed, watch } from 'vue'
import { getLocalTimeZone } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import { useVeterinarioStore } from '@/store/useVeterinarioStore'
import type { Veterinario } from '@/types/Veterinario'

export function useDisponibilidadVeterinario(fecha: Ref<DateValue | undefined>) {
  const store = useVeterinarioStore()
  const veterinarioSelected = ref<Veterinario | null>(null)

  const diasMap: Record<string, number> = {
    Domingo: 0,
    Lunes: 1,
    Martes: 2,
    Miércoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
  }

  const diasHabilitados = computed(() =>
    Array.from(new Set(
      veterinarioSelected.value?.horarios.map(h => diasMap[h.dia_semana]) || []
    ))
  )

  const horasDisponibles = computed(() =>
    store.horariosDisponibles.filter(h => h.disponible).map(h => h.hora)
  )

  // Watch para traer disponibilidad al seleccionar fecha
  watch(fecha, async (nuevaFecha) => {
    if (!nuevaFecha || !veterinarioSelected.value) return

    const fechaISO = nuevaFecha.toDate(getLocalTimeZone()).toISOString().split('T')[0]
    await store.fetchDisponibilidad(veterinarioSelected.value.id, fechaISO)
  })

  function seleccionarVeterinario(id: number | null) {
    if (!id) {
      veterinarioSelected.value = null
      store.veterinario = null
      store.clearHorarios()
      return
    }

    const vet = store.veterinarios.find(v => v.id === id)
    veterinarioSelected.value = vet ?? null
    store.veterinario = vet ?? null
    store.clearHorarios()
  }

  return {
    store,
    veterinarioSelected,
    seleccionarVeterinario,
    diasHabilitados,
    horasDisponibles
  }
}
