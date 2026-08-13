/// <reference types="vitest" />
/// <reference types="vite/client" />

import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "./",
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  optimizeDeps: { exclude: ["fsevents"] },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/testing/setup-tests.ts",
    exclude: ["**/node_modules/**", "**/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.*", "src/**/*.spec.*", "src/app/+types/**"],
    },
  },
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    rollupOptions: {
      external: ["fs/promises"],
    },
  },
});
