import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', // Ruta raíz redirigida a '/home'
      name: 'home',
      component: HomeView
    },
    {
      path: '/login', // Ruta para la vista de Login
      name: 'login',
      component: LoginView
    }
  ]
})

export default router
