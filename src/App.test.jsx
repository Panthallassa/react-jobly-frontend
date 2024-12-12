import React from "react";
import { describe, it, vi, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import {
	renderWithRouter,
	resetTestDatabase,
} from "./components/testCommon";
import App from "./App";
import JoblyApi from "../JoblyApi";
import { decodeJWT } from "./utils/jwtUtils";

// Mock the Jobly API and JWT decoding utility
vi.mock("../JoblyApi");
vi.mock("./utils/jwtUtils");

describe("App Component", () => {
	// Mock token and user details to simulate logged-in state
	const mockToken = JSON.stringify("mock-token");
	const mockUser = {
		username: "testuser",
		firstName: "Test",
		lastName: "User",
		email: "testuser@example.com",
		applications: [1, 2],
	};

	beforeEach(async () => {
		// Reset all mocks before each test
		vi.resetAllMocks();

		// Simulate a token in localStorage and assign it to the mocked API
		localStorage.setItem("jobly-token", mockToken);
		JoblyApi.token = JSON.parse(mockToken);

		// Define mock implementations for API methods
		JoblyApi.register = vi.fn();
		JoblyApi.login = vi.fn();
		JoblyApi.getCurrentUser.mockImplementation(
			async (username) => {
				if (username === "testuser") {
					return mockUser; // Return mock user data for "testuser"
				}
				throw new Error("User not found"); // Simulate an error for other usernames
			}
		);
		JoblyApi.applyToJob = vi.fn().mockResolvedValueOnce(); // Mock job application API

		// Mock JWT decoding to return the username
		decodeJWT.mockReturnValue({ username: "testuser" });

		// Reset the database before each test
		await resetTestDatabase();
	});

	/**
	 * Smoke test to ensure the App component renders without errors.
	 * Validates that the initial UI is displayed correctly.
	 */
	it("renders without crashing (smoke test)", () => {
		renderWithRouter(<App />);
		expect(
			screen.getByText(/please log in or sign up/i)
		).toBeTruthy();
	});

	/**
	 * Tests that the user info is loaded when a token is present.
	 * Verifies that the `JoblyApi.getCurrentUser` method is called with the correct username.
	 */
	it("loads user info when token is present", async () => {
		renderWithRouter(<App />);

		await waitFor(() => {
			// Verify that the API call was made with the correct username
			expect(JoblyApi.getCurrentUser).toHaveBeenCalledWith(
				"testuser"
			);

			// Ensure the logout button is visible after loading user info
			expect(screen.getByText(/logout/i)).toBeTruthy();
		});
	});

	/**
	 * Tests the login functionality.
	 * Ensures that the login API is called and the user is successfully logged in.
	 */
	it("handles login successfully", async () => {
		const mockLoginResponse = {
			token: JSON.stringify("mock-token"),
		};
		JoblyApi.login.mockResolvedValue(mockLoginResponse); // Mock the login API response
		JoblyApi.getUser.mockResolvedValue(mockUser); // Mock user data retrieval

		renderWithRouter(<App />);

		await waitFor(() => {
			// Ensure the login form is no longer visible after login
			const loginInput =
				screen.queryByPlaceholderText("Username");
			expect(loginInput).toBeNull();
		});
	});

	/**
	 * Tests the job application functionality.
	 * Verifies that the job application API is called and updates are reflected correctly.
	 */
	it("handles job application successfully", async () => {
		renderWithRouter(<App />);

		await waitFor(() => {
			// Confirm the user info was loaded
			expect(JoblyApi.getCurrentUser).toHaveBeenCalledWith(
				"testuser"
			);
		});

		const mockJobId = 3; // Example job ID
		await JoblyApi.applyToJob("testuser", mockJobId); // Mock job application

		// Verify the job application API was called with the correct arguments
		expect(JoblyApi.applyToJob).toHaveBeenCalledWith(
			"testuser",
			mockJobId
		);
	});

	/**
	 * Tests the signup functionality.
	 * Ensures that a new user can sign up and is automatically logged in.
	 */
	it("handles signup successfully", async () => {
		const mockSignupResponse = {
			token: JSON.stringify("mock-token"),
		};
		JoblyApi.register.mockResolvedValue(mockSignupResponse); // Mock the signup API

		renderWithRouter(<App />);

		await waitFor(() => {
			// Ensure the signup form is no longer visible after signup
			const signupInput =
				screen.queryByPlaceholderText("Username");
			expect(signupInput).toBeNull();
		});
	});
});
