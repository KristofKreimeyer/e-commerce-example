import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
// import CartPage from '@/pages/CartPage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  // { path: '/cart', name: 'Cart', component: CartPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
