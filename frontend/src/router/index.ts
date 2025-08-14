// src/router/index.ts
import { createRouter, createWebHistory} from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // ===== CLIENTE & ADMIN COMPARTEN =====
  {
    path: '/',
    name: 'appointments',
    component: () => import('@/pages/AgendarTurno.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: () => import('../pages/Perfil.vue'),
    meta: { requiresAuth: true }
  },

  // ===== CLIENTE =====
  {
    path: '/mis-turnos',
    name: 'mis-turnos',
    component: () => import('../pages/MisTurnos.vue'),
    meta: { requiresAuth: true, role: 'client' }
  },

  // ===== ADMIN =====
  {
    path: '/turnos',
    name: 'daily',
    component: () => import('../pages/TurnosDia.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/pages/Admin.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },

  // ===== 404 =====
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
