import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,mjs,ts}'],
    exclude: [
      '**/node_modules/**',
      '**/._*'
    ]
  }
})
