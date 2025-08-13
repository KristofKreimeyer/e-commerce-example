import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

import type { ConfigEnv } from 'vite'

const env: ConfigEnv = { mode: 'test', command: 'serve' }
const resolvedViteConfig = typeof viteConfig === 'function' ? viteConfig(env) : viteConfig

export default mergeConfig(
  resolvedViteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: ['./src/components/__tests__/setup.ts'],
    },
  }),
)
