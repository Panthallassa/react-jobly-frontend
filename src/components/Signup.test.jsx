import React from "react";
import { describe, it, expect, vi } from "vitest";
import {
	render,
	screen,
	fireEvent,
	waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Signup from "./Signup";
import axios from "axios";

// Mock axios
vi.mock("axios");

describe("Signup Component", () => {
	// Smoke test: Ensure the component renders without crashing
	it("renders without crashing (smoke test)", () => {
		render(
			<MemoryRouter>
				<Signup />
			</MemoryRouter>
		);

		// Check if the heading and prompt are displayed
		expect(screen.getByText("Signup")).toBeTruthy();
		expect(
			screen.getByText("Create an account to get started.")
		).toBeTruthy();
	});

	// Test: Handles form submission and calls axios
	it("handles form submission and calls axios", async () => {
		// Mock axios response
		axios.post.mockResolvedValueOnce({
			data: { token: "mockToken" },
		});

		// Render the component
		render(
			<MemoryRouter>
				<Signup />
			</MemoryRouter>
		);

		// Fill out the form
		fireEvent.change(
			screen.getByPlaceholderText("Username"),
			{
				target: { value: "testuser" },
			}
		);
		fireEvent.change(
			screen.getByPlaceholderText("Password"),
			{
				target: { value: "password123" },
			}
		);
		fireEvent.change(
			screen.getByPlaceholderText("First Name"),
			{
				target: { value: "Test" },
			}
		);
		fireEvent.change(
			screen.getByPlaceholderText("Last Name"),
			{
				target: { value: "User" },
			}
		);
		fireEvent.change(screen.getByPlaceholderText("Email"), {
			target: { value: "testuser@example.com" },
		});

		// Submit the form
		fireEvent.click(
			screen.getByRole("button", { name: /signup/i })
		);

		// Wait for the axios call
		await waitFor(() => {
			// Check if axios.post was called with the correct arguments
			expect(axios.post.mock.calls.length).toBe(1);
			const [[url, data]] = axios.post.mock.calls;
			expect(url).toBe(
				"http://localhost:3001/api/users/auth/register"
			);
			expect(data).toEqual({
				username: "testuser",
				password: "password123",
				firstName: "Test",
				lastName: "User",
				email: "testuser@example.com",
			});
		});
	});

	// Test: Handles signup errors gracefully
	it("handles signup errors gracefully", async () => {
		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		// Mock axios to reject with an error
		axios.post.mockRejectedValueOnce(
			new Error("Signup Failed")
		);

		render(
			<MemoryRouter>
				<Signup />
			</MemoryRouter>
		);

		// Simulate filling out the signup form
		fireEvent.change(
			screen.getByPlaceholderText("Username"),
			{
				target: { value: "testuser" },
			}
		);
		fireEvent.change(
			screen.getByPlaceholderText("Password"),
			{
				target: { value: "password123" },
			}
		);
		fireEvent.change(
			screen.getByPlaceholderText("First Name"),
			{
				target: { value: "Test" },
			}
		);
		fireEvent.change(
			screen.getByPlaceholderText("Last Name"),
			{
				target: { value: "User" },
			}
		);
		fireEvent.change(screen.getByPlaceholderText("Email"), {
			target: { value: "testuser@example.com" },
		});

		// Submit the form
		fireEvent.click(
			screen.getByRole("button", { name: /signup/i })
		);

		// Wait for error handling
		await waitFor(() => {
			// Assert axios.post was called
			if (axios.post.mock.calls.length === 0) {
				throw new Error("axios.post was not called.");
			}

			// Assert console.error was called with expected arguments
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"Signup Failed:",
				expect.anything()
			);
		});

		// Clean up mock
		consoleErrorSpy.mockRestore();
	});
});
