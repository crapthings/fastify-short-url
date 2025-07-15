import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,mjs,ts}'],
    exclude: [
      '**/node_modules/**',
      '**/._*' // 排除所有 ._ 开头的文件
    ]
  }
})
