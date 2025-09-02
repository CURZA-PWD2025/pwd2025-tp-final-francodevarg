import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/useAuthStore'
import { useMascotaStore } from '@/store/useMascotaStore'

let registered = false

export function useAuthEffects() {
  if (registered) return
  registered = true

  const auth = useAuthStore()
  const mascotas = useMascotaStore()
  const { user } = storeToRefs(auth)

  // Reacciona cuando hay/cambia el usuario autenticado
  watch(
    user,
    async (u) => {
      if (u?.id && u.tipo === 'cliente'){
        await mascotas.fetchByUserId(u.id)
      } else {
        mascotas.clearMascotas()
      }
    },
    { immediate: true } // cubre restoreSession y hard refresh
  )
}
