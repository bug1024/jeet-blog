import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  publicDir: false,
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "apps/our-secret-world/src/main.ts"),
      formats: ["es"],
      fileName: () => "our-secret-world.js",
      cssFileName: "our-secret-world"
    },
    outDir: resolve(__dirname, "static/works/our-secret-world/app"),
    rollupOptions: { output: { assetFileNames: "[name][extname]" } }
  }
});
