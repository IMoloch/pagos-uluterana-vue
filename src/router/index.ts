import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SelectPay from '@/views/SelectPay.vue'
import DetailPay from '@/views/DetailPay.vue'
import ProfileView from '@/views/ProfileView.vue'
import { useFirebaseService } from '@/utilities/firebase.service'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true } // Ruta protegida
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/months',
      name: 'months',
      component: SelectPay,
      meta: { requiresAuth: true } // Ruta protegida
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true } // Ruta protegida
    },
    {
      path: '/DetailPay',
      name: 'DetailPay',
      component: DetailPay,
      props: (route) => ({ ultimaFechaDePago: route.query.ultimaFechaDePago }),
      meta: { requiresAuth: true } // Ruta protegida
    }
  ]
})

router.beforeEach(async (to) => {
  const isAuth = await useFirebaseService().getAuth()
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    if (!isAuth) return { name: 'login' } // Redirigir al login si no está autenticado
  } else {
    if (isAuth && to.name === 'login') return { name: 'home' } // Redirigir al home si está autenticado y visita login
  }
})

export default router
