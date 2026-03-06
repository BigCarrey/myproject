import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/myproject/',
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // 监听所有网络接口，支持局域网远程访问
  },
})
