import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	define: {
		// Use VITE_BASE_URL from the environment or default to localhost
		"process.env.BASE_URL": JSON.stringify(
			process.env.meta.VITE_BASE_URL ||
				"http://localhost:3001"
		),
	},
	// server: {
	// 	// Proxy API calls to the backend
	// 	proxy: {
	// 		"/api": {
	// 			target:
	// 				process.env.REACT_APP_BASE_URL ||
	// 				"http://localhost:3001",
	// 			changeOrigin: true, // Ensure the origin header matches the target
	// 		},
	// 	},
	// },
});
