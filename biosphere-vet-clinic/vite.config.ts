import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    allowedHosts: [
      "biosphere-frontend.onrender.com",
      "biosfera-frontend.onrender.com",
      "biophere.onrender.com"
    ]
  }
})

