import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { config } from "dotenv";
import axios from "axios";

// Load environment variables from .env.test
config({ path: ".env.test" });

// Ensure your backend is pointing to the test server
axios.defaults.baseURL =
	process.env.VITE_BASE_URL || "http://localhost:3001";

/**
 * Helper function to wrap components in the BrowserRouter for testing.
 * Use this for components requiring routing context.
 *
 * @param {React.ReactElement} ui - The component to render.
 * @param {Object} options - Additional options for render.
 */
export function renderWithRouter(
	ui,
	{ route = "/", ...options } = {}
) {
	window.history.pushState({}, "Test page", route);

	// Only wrap with BrowserRouter if the component isn't already wrapped
	const Wrapper =
		ui.type.name === "App" ? React.Fragment : BrowserRouter;

	return render(ui, { wrapper: Wrapper });
}

/**
 * Mock function to reset the test database.
 * Ensure your backend exposes an API endpoint like `/reset-database` for testing.
 */
export async function resetTestDatabase() {
	try {
		await axios.post("/reset-database");
		console.log("Test database reset successfully.");
	} catch (err) {
		console.error("Error resetting test database:", err);
	}
}
