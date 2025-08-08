import { defineConfig } from 'vite';

export default defineConfig({
  // Configurações do servidor de desenvolvimento
  server: {
    port: 5173,
    host: 'localhost',
    open: true,
    cors: true
  },

  // Configurações de build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['axios']
        }
      }
    }
  },

  // Configurações de preview
  preview: {
    port: 4173,
    host: 'localhost',
    open: true
  },

  // Configurações de resolução
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@utils': '/src/utils',
      '@styles': '/src/styles',
      '@api': '/src/api'
    }
  },

  // Configurações de CSS
  css: {
    devSourcemap: true
  },

  // Configurações de otimização
  optimizeDeps: {
    include: ['axios']
  }
}); 