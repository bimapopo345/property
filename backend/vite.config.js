import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "test/"],
    },
    setupFiles: ["./vitest.setup.js"],
    testTimeout: 10000,
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    reporters: ["verbose"],
    isolate: false,
  },
});
