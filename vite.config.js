import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // api: "modern-compiler", // Enable modern Sass API
        // silenceDeprecations: ['legacy-js-api'], // Alternative: silence the warning
        additionalData: `@forward "./src/styles/_variables.scss";` // Use @forward for global-like access
      }
    }
  }
});
