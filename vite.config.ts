import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/youtube-api": {
        target: "https://www.youtube.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/youtube-api/, ""),
      },
    },
  },
});
