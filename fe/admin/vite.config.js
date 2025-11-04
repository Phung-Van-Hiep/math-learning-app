import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:9532',
        changeOrigin: true,
      }
    }
  }
})
