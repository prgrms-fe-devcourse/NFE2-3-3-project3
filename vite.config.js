import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // @를 src 디렉토리로 매핑
    },
  },
  define: {
    __VUE_PROD_DEVTOOLS__: true, // 개발자 도구 활성화
  },
  optimizeDeps: {
    exclude: ['chart.js/auto']
  }
});
