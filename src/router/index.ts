import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import ProductDetail from '@/pages/ProductDetail.vue'
import CartPage from '@/pages/CartPage.vue'
import CatalogPage from '@/pages/CatalogPage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/products', name: 'Products', component: CatalogPage },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetail },
  { path: '/cart', name: 'Cart', component: CartPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
