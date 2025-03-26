import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "tailwindcss"; // Import Tailwind CSS
import autoprefixer from "autoprefixer"; // Import Autoprefixer

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
        tailwindcss, // Use the imported Tailwind CSS
        autoprefixer, // Use the imported Autoprefixer
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