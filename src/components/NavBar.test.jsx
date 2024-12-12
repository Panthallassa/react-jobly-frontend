import React from "react";
import { describe, it, expect, vi } from "vitest";
import {
	render,
	screen,
	fireEvent,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavBar from "./NavBar";

/**
 * This test suite verifies the functionality of the NavBar component using Vitest and React Testing Library.
 * It ensures the component renders correctly based on the user's authentication status
 * and that the logout button behaves as expected.
 */

describe("NavBar Component", () => {
	// Smoke test: Ensure the component renders without crashing.
	it("renders without crashing (smoke test)", () => {
		render(
			<MemoryRouter>
				<NavBar currentUser={null} logout={() => {}} />
			</MemoryRouter>
		);
		const loginLink = screen.getByText("Login");
		expect(loginLink).toBeTruthy(); // Check if the element exists
	});

	// Test: Displays links for logged-out users.
	it("displays login and signup links when no user is logged in", () => {
		render(
			<MemoryRouter>
				<NavBar currentUser={null} logout={() => {}} />
			</MemoryRouter>
		);

		const loginLink = screen.getByText("Login");
		const signUpLink = screen.getByText("Sign Up");

		expect(loginLink).toBeTruthy(); // Ensure the Login link exists
		expect(signUpLink).toBeTruthy(); // Ensure the Sign Up link exists
		expect(screen.queryByText("Logout")).toBeNull(); // Ensure the Logout button does not exist
	});

	// Test: Displays navigation links for logged-in users.
	it("displays navigation links and logout button when a user is logged in", () => {
		const mockUser = { username: "testuser" };

		render(
			<MemoryRouter>
				<NavBar currentUser={mockUser} logout={() => {}} />
			</MemoryRouter>
		);

		expect(screen.getByText("Home")).toBeTruthy();
		expect(screen.getByText("Companies")).toBeTruthy();
		expect(screen.getByText("Jobs")).toBeTruthy();
		expect(screen.getByText("Profile")).toBeTruthy();
		expect(screen.getByText("Logout")).toBeTruthy();
		expect(screen.queryByText("Login")).toBeNull();
		expect(screen.queryByText("Sign Up")).toBeNull();
	});

	// Test: Logout button calls the logout function.
	it("calls logout function when logout button is clicked", () => {
		const mockUser = { username: "testuser" };
		const mockLogout = vi.fn();

		render(
			<MemoryRouter>
				<NavBar
					currentUser={mockUser}
					logout={mockLogout}
				/>
			</MemoryRouter>
		);

		const logoutButton = screen.getByText("Logout");
		fireEvent.click(logoutButton);

		expect(mockLogout).toHaveBeenCalledTimes(1); // Ensure the logout function is called once
	});
});
