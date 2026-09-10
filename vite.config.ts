import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { fileURLToPath } from 'node:url'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      // package.json 的 "#/*" imports 字段 Vite 不读取，这里显式映射
      '#/': fileURLToPath(new URL('./src/', import.meta.url)),
    },
  },
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
})

export default config
