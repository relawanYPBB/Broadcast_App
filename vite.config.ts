import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use a type-safe way to access env vars in the config itself
const API_KEY = (process.env as any).API_KEY || '';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(API_KEY)
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});