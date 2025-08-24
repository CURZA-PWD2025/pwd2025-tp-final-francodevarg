import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'

// Lazy load de páginas
const HomePage = () => import('@/pages/Home.vue')
const LoginPage = () => import('@/pages/Login.vue')
const AppointmentsPage = () => import('@/pages/AgendarTurno.vue')
const MyAppointmentsPage = () => import('@/pages/MisTurnos.vue')
const AdminPage = () => import('@/pages/Admin.vue')

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
    meta: { requiresAuth: true, role: 'client' }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPage,
    meta: { requiresAuth: true, role: 'admin' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Guard global
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // restaurar sesión en caso de refresh
  if (!authStore.user && localStorage.getItem('token')) {
    authStore.restoreSession()
  }

  // rutas públicas -> libre acceso
  if (to.meta.public) {
    // 🔒 Si el user ya está logueado, no dejar ir a login
    if (to.name === 'login' && authStore.user) {
      return authStore.user.tipo === 'admin'
        ? next({ name: 'admin' })
        : next({ name: 'appointments' })
    }
    return next()
  }

  // rutas protegidas
  if (to.meta.requiresAuth && !authStore.user) {
    return next({ name: 'login' })
  }

  // rutas por rol
  if (to.meta.role && authStore.user?.tipo !== to.meta.role) {
    return next({ name: 'home' })
  }

  return next()
})

export default router

