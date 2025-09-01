import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'

// Lazy load de páginas
const LoginPage = () => import('@/pages/Login.vue')
const AppointmentsPage = () => import('@/pages/AgendarTurno.vue')
const MyAppointmentsPage = () => import('@/pages/MisTurnos.vue')
const AdminPage = () => import('@/pages/Admin.vue')
const TurnosDia = () => import('@/pages/TurnosDia.vue')
const Perfil = () => import('@/pages/Perfil.vue')
const Mascotas = () => import('@/pages/Mascotas.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'appointments',
    component: AppointmentsPage,
    meta: { public: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { public: true }
  },
  {
    path: '/mis-turnos',
    name: 'my-appointments',
    component: MyAppointmentsPage,
    meta: { requiresAuth: true, role: 'cliente' }
  },
  {
    path: '/mis-mascotas',
    name: 'mis-mascotas',
    component: Mascotas,
    meta: { requiresAuth: true, role: 'cliente' }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPage,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/turnos',
    name: 'turnos',
    component: TurnosDia,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: Perfil,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'appointments' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard global
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // restaurar sesión en caso de refresh
  if (!authStore.user && localStorage.getItem('token')) {
    authStore.restoreSession()
  }

  // rutas públicas -> libre acceso
  if (to.meta.public) {
    // si ya está logueado, no dejar ir a login
    if (to.name === 'login' && authStore.user) {
      return authStore.user.tipo === 'admin'
        ? next({ name: 'admin' })
        : next({ name: 'my-appointments' })
    }
    return next()
  }

  // rutas protegidas
  if (to.meta.requiresAuth && !authStore.user) {
    return next({ name: 'login' })
  }

  if (to.meta.role && authStore.user?.tipo !== to.meta.role) {
    return next(
      authStore.user?.tipo === 'admin'
        ? { name: 'admin' }
        : { name: 'appointments' }
    )
  }

  return next()
})

export default router
