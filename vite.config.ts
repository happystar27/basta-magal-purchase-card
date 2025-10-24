import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist', // Changed from 'build' to 'dist' (Vite convention)
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    minify: 'esbuild', // Use esbuild (faster and included with Vite)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          wagmi: ['wagmi', '@web3modal/wagmi']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'wagmi', '@web3modal/wagmi']
  },
  // Performance optimizations
  css: {
    devSourcemap: false
  },
  // Asset handling
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg']
})
