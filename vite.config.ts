/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Resizes/re-encodes images imported with query directives (see src/lib/photos.ts)
    imagetools({ cache: { enabled: true, dir: './node_modules/.cache/imagetools' } }),
  ],
  test: {
    environment: 'jsdom',
    restoreMocks: true,
    setupFiles: ['./src/test-setup.ts'],
  },
  server: {
    port: 5173, // Default Vite port
    strictPort: false, // Automatically use next available port if this one is taken
  },
})
