import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,mjs,ts}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/._{0,1}*', // 排除所有 ._ 开头的文件
      '**/._*/**'
    ]
  }
})
