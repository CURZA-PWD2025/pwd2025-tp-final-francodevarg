import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import DatosCliente from '../pages/DatosCliente.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/cliente' },
  { path: '/cliente', component: DatosCliente },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
