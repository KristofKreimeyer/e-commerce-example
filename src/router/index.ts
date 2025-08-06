import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import ProductDetail from '@/pages/ProductDetail.vue'
import AppCart from '@/components/AppCart.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetail },
  { path: '/cart', name: 'Cart', component: AppCart },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
