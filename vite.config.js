import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 默认是 5173
    host: '0.0.0.0', // 如果你希望在局域网中访问你的开发服务器
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 根据需要自定义你的 chunk 划分
          vendor: ['react', 'react-dom', 'axios'],
        },
      },
    },
  },
})
