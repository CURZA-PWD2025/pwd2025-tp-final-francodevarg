import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/useAuthStore'
import { useMascotaStore } from '@/store/useMascotaStore'
import { useMisTurnos } from '@/store/useMisTurnosStore'

let registered = false

export function useAuthEffects() {
  if (registered) return
  registered = true

  const auth = useAuthStore()
  const mascotas = useMascotaStore()
  const turnos = useMisTurnos()
  const { user } = storeToRefs(auth)

  // Reacciona cuando hay/cambia el usuario autenticado
  watch(
    user,
    async (u) => {
      if (u?.id && u.tipo === 'cliente'){
        await mascotas.fetchByUserId(u.id)
        await turnos.fetchTurnos(u.id)
      } else {
        mascotas.clearMascotas()
        turnos.clearTurnos()
      }
    },
    { immediate: true } // cubre restoreSession y hard refresh
  )
}
