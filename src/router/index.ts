import { createRouter, createWebHistory } from 'vue-router'
import { Firebase } from '@/utilities/firebase.service'
import HomeView from '@/views/HomeView.vue'
import LoginView from '../views/LoginView.vue' // Importar la vista de Login
import SelectPay from '@/views/SelectPay.vue'
import DetailPay from '@/views/DetailPay.vue'
import HomeView from '@/views/HomeView.vue'
import ProfileView from '@/views/ProfileView.vue'

// const firebase = new Firebase()
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login', // Ruta para la vista de Login
      name: 'login',
      component: LoginView
    },
    {
      path: '/months',
      name: 'months',
      component: SelectPay
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/DetailPay',
      name: 'DetailPay',
      component: DetailPay,
      props: route => ({ ultimaFechaDePago: route.query.ultimaFechaDePago })
    }, 
  ]
})

// router.beforeEach(async (to) => {
//   const isAuth = await firebase.getAuth();
//   if (to.matched.some((route) => route.meta.requiresAuth)) {
//     if (!isAuth) return { name: 'login' }
//   } else {
//     if (isAuth) return { name: 'home'}
//   }
// });

export default router
