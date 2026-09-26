import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' so the build works on GitHub Pages under /tadreeb/
export default defineConfig({
  plugins: [react()],
  base: './',
})
