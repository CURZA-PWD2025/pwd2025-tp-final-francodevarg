import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'

// Páginas
const PaginaAutenticarUsuario = () => import('@/pages/AuthPage.vue')
const PaginaAgendarTurno = () => import('@/pages/AgendarTurno.vue')
const PaginaMisTurnos = () => import('@/pages/MisTurnos.vue')
const PaginaAdmin = () => import('@/pages/Admin.vue')
const PaginaTurnosDia = () => import('@/pages/TurnosDia.vue')
const PaginaPerfil = () => import('@/pages/Perfil.vue')
const PaginaMascotas = () => import('@/pages/Mascotas.vue')
const PaginaNoEncontrada = () => import('@/pages/NotFound.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'agendar-turno',
    component: PaginaAgendarTurno,
    meta: { public: true }
  },
  {
    path: '/auth',
    name: 'iniciar-sesion',
    component: PaginaAutenticarUsuario,
    meta: { public: true }
  },
  {
    path: '/mis-turnos',
    name: 'mis-turnos',
    component: PaginaMisTurnos,
    meta: { requiresAuth: true, role: 'cliente' }
  },
  {
    path: '/mis-mascotas',
    name: 'mis-mascotas',
    component: PaginaMascotas,
    meta: { requiresAuth: true, role: 'cliente' }
  },
  {
    path: '/admin',
    name: 'administracion',
    component: PaginaAdmin,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/turnos',
    name: 'turnos-del-dia',
    component: PaginaTurnosDia,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: PaginaPerfil,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: PaginaNoEncontrada
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard global
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Restaurar sesión si hay token pero no hay usuario
  if (!authStore.user && localStorage.getItem('token')) {
    await authStore.restoreSession()
  }

  // rutas públicas -> libre acceso
  if (to.meta.public) {
    // si ya está logueado, no dejar ir a login
    if (to.name === 'iniciar-sesion' && authStore.user) {
      return authStore.user.tipo === 'admin'
        ? next({ name: 'administracion' })
        : next({ name: 'mis-turnos' })
    }
    return next()
  }

  // rutas protegidas
  if (to.meta.requiresAuth && !authStore.user) {
    return next({ name: 'iniciar-sesion' })
  }

  if (to.meta.role && authStore.user?.tipo !== to.meta.role) {
    return next(
      authStore.user?.tipo === 'admin'
        ? { name: 'administracion' }
        : { name: 'agendar-turno' }
    )
  }

  return next()
})

export default router
