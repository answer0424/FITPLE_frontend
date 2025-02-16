import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: "public",
  build: {
    cssCodeSplit: false, // CSS 파일을 분할하지 않음
  },
});
