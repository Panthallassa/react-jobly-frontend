import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	return {
		define: {
			// Explicitly set NODE_ENV to match the build mode
			"process.env.NODE_ENV": JSON.stringify(
				mode === "production" ? "production" : "development"
			),
		},
		optimizeDeps: {
			include: ["jwt-decode"],
		},
		plugins: [react()],
		server: {
			proxy: {
				"/api": "http://localhost:3001", // Proxy backend API requests
			},
		},
		test: {
			globals: true,
			environment: "jsdom", // Sets the test environment to jsdom
			css: true, // Ensures that CSS imports don’t break tests
			exclude: [...configDefaults.exclude],
		},
	};
});
