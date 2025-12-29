import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Polyfill process.env for the browser if needed by legacy code, 
    // though the index.html shim also handles this.
    'process.env': process.env
  }
});