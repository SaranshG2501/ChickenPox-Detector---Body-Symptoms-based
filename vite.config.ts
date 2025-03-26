
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcssPlugin from 'tailwindcss';
import autoprefixerPlugin from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcssPlugin(),
        autoprefixerPlugin(),
      ],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
        }
      }
    }
  }
});
