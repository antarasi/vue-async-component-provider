import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    dts({
      tsconfigPath: './tsconfig.build.json',
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "AsyncComponentProvider",
      fileName: "async-component-provider",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
})
