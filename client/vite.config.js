import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://ai-ad-creative-generator.onrender.com",
        changeOrigin: true,
        secure: true,
      },
      "/generated": {
        target: "https://ai-ad-creative-generator.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});