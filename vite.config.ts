import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve as path_res } from "path"
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "$icons": path_res(__dirname, "./src/assets/icons"),
      "$assets": path_res(__dirname, "./src/assets"),
    }
  }
})
