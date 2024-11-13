import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SelectPay from '@/views/SelectPay.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/months',
      name: 'months',
      component: SelectPay
    }
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
