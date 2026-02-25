// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// si lovable-tagger te da lata, déjalo solo en dev (como ya lo tenías)
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: "/Funderelele/", // <-- IMPORTANTÍSIMO (repo name)
  plugins: [
    react(),
    mode === "development" ? componentTagger() : undefined,
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));