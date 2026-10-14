import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    host: "0.0.0.0",
  },
  test: {
    exclude: ["tests/e2e/**", "node_modules/**"],
  },
});
