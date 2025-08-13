import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import ProductDetail from '@/pages/ProductDetail.vue'
import CartPage from '@/pages/CartPage.vue'
import CatalogPage from '@/pages/CatalogPage.vue'
import Wishlist from '@/pages/Wishlist.vue'
import Account from '@/components/account/AccountView.vue'
import { useAuth } from '@/stores/authStore'

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
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta: { title: 'Mein Konto', requiresAuth: true },
  },
  {
    path: '/signIn',
    name: 'SignIn',
    component: () => import('@/components/account/LoginView.vue'),
    meta: { title: 'Login' },
  },
  {
    path: '/signUp',
    name: 'SignUp',
    component: () => import('@/components/account/RegisterView.vue'),
    meta: { title: 'Registrieren' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  console.table(
    to.matched.map((r) => ({
      name: String(r.name),
      path: r.path,
      requiresAuth: Boolean(r.meta?.requiresAuth),
    })),
  )

  const requiresAuth = to.matched.some((r) => r.meta?.requiresAuth)
  const { token } = useAuth()

  if (requiresAuth && !(typeof token === 'string' && token.length > 0)) {
    return { path: 'signIn', query: { redirect: to.fullPath } }
  }
})
export default router
