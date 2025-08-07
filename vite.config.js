import { defineConfig } from 'vite'

export default defineConfig({
  // Configuração do servidor de desenvolvimento
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  
  // Configuração de build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  
  // Configuração de preview
  preview: {
    port: 4173
  }
}) 