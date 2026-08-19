import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  publicDir: false,
  define: {
    "process.env.NODE_ENV": JSON.stringify("production")
  },
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "apps/our-little-world/src/main.ts"),
      formats: ["es"],
      fileName: () => "our-little-world.js",
      cssFileName: "our-little-world"
    },
    outDir: resolve(__dirname, "static/works/our-little-world/app"),
    rollupOptions: {
      output: {
        assetFileNames: "[name][extname]"
      }
    }
  }
});
