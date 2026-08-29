import { defineConfig } from "vite";

export default defineConfig({
  base: "/", // 👈 clave
  build: {
    outDir: "dist", // 👈 carpeta que va a leer GitHub Pages
  },
});
