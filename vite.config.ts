import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [vue(), vueJsx(), mode !== 'production' && vueDevTools(), tailwindcss()].filter(Boolean),
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
}))
