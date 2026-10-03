import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    entries: ["app.html"]
  },
  build: {
    rollupOptions: {
      input: "app.html"
    }
  }
});
