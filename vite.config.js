import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
	optimizeDeps: {
		include: ["jwt-decode"],
	},
	plugins: [react()],
	server: {
		proxy: {
			"/api": "http://localhost:3001",
		},
	},
	test: {
		globals: true,
		environment: "jsdom", // Sets the test environment to jsdom
		css: true, // Ensures that CSS imports don’t break tests
		exclude: [...configDefaults.exclude],
	},
});
