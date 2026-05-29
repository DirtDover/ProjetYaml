import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // 👈 Ajoute cette ligne pour que les liens vers les fichiers JS/CSS soient relatifs
});
