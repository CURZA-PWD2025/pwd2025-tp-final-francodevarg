import { createRouter, createWebHistory } from 'vue-router'
import AgendarTurno from '@/pages/AgendarTurno.vue'
import Admin from '@/pages/Admin.vue'

const routes = [
  {
    path: '/',
    name: 'AgendarTurno',
    component: AgendarTurno,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
