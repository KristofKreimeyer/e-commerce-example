import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import ProductDetail from '@/pages/ProductDetail.vue'
import CartPage from '@/pages/CartPage.vue'
import CatalogPage from '@/pages/CatalogPage.vue'
import Wishlist from '@/pages/Wishlist.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage, meta: { title: 'Startseite' } },
  { path: '/catalog', name: 'Catalog', component: CatalogPage, meta: { title: 'Katalog' } },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    meta: { title: 'Produktdetail' },
  },
  { path: '/cart', name: 'Cart', component: CartPage, meta: { title: 'Warenkorb' } },
  {
    path: '/wishlist',
    name: 'wishlist',
    component: Wishlist,
    meta: { title: 'Wunschzettel' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
