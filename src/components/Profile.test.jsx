import React from "react";
import { describe, it, expect, vi } from "vitest";
import {
	render,
	screen,
	fireEvent,
	waitFor,
} from "@testing-library/react";
import Profile from "./Profile";

/**
 * Test suite for the Profile component.
 * This suite verifies rendering, input handling, form submission, and feedback messages.
 */

describe("Profile Component", () => {
	const mockUser = {
		username: "testuser",
		firstName: "Test",
		lastName: "User",
		email: "testuser@example.com",
	};

	const mockUpdateUser = vi.fn();

	// Smoke test: Ensure the component renders without crashing.
	it("renders without crashing (smoke test)", () => {
		render(
			<Profile
				currentUser={mockUser}
				updateUser={mockUpdateUser}
			/>
		);

		const heading = screen.getByText("Profile");
		expect(heading).not.toBeNull(); // Verify the heading is present
	});

	// Test: Verify initial input values are set from currentUser.
	it("displays initial user data in the form fields", () => {
		render(
			<Profile
				currentUser={mockUser}
				updateUser={mockUpdateUser}
			/>
		);

		const usernameInput =
			screen.getByDisplayValue("testuser");
		const firstNameInput = screen.getByDisplayValue("Test");
		const lastNameInput = screen.getByDisplayValue("User");
		const emailInput = screen.getByDisplayValue(
			"testuser@example.com"
		);

		// Check if the username input is disabled
		expect(
			usernameInput.getAttribute("disabled")
		).not.toBeNull();
		// Validate other input values
		expect(firstNameInput.value).toEqual("Test");
		expect(lastNameInput.value).toEqual("User");
		expect(emailInput.value).toEqual(
			"testuser@example.com"
		);
	});

	// Test: Verify form submission triggers updateUser with correct data.
	it("calls updateUser with the updated data on form submission", async () => {
		render(
			<Profile
				currentUser={mockUser}
				updateUser={mockUpdateUser}
			/>
		);

		const firstNameInput =
			screen.getByLabelText("First Name:");
		const lastNameInput =
			screen.getByLabelText("Last Name:");
		const emailInput = screen.getByLabelText("Email:");
		const passwordInput =
			screen.getByLabelText("Password:");

		fireEvent.change(firstNameInput, {
			target: { value: "Updated" },
		});
		fireEvent.change(lastNameInput, {
			target: { value: "User" },
		});
		fireEvent.change(emailInput, {
			target: { value: "updated@example.com" },
		});
		fireEvent.change(passwordInput, {
			target: { value: "password123" },
		});

		fireEvent.click(screen.getByText("Save Changes"));

		await waitFor(() => {
			expect(mockUpdateUser).toHaveBeenCalledWith({
				firstName: "Updated",
				lastName: "User",
				email: "updated@example.com",
				password: "password123",
			});
		});
	});

	// Test: Verify success message is displayed after successful update.
	it("displays a success message after updating the profile", async () => {
		mockUpdateUser.mockResolvedValueOnce();

		render(
			<Profile
				currentUser={mockUser}
				updateUser={mockUpdateUser}
			/>
		);

		const passwordInput =
			screen.getByLabelText("Password:");
		fireEvent.change(passwordInput, {
			target: { value: "password123" },
		});
		fireEvent.click(screen.getByText("Save Changes"));

		await waitFor(() => {
			const message = screen.getByText(
				"Profile updated successfully!"
			);
			expect(message).not.toBeNull();
		});
	});

	// Test: Verify error message is displayed if updating the profile fails.
	it("displays an error message if profile update fails", async () => {
		mockUpdateUser.mockRejectedValueOnce(
			new Error("Update failed")
		);

		render(
			<Profile
				currentUser={mockUser}
				updateUser={mockUpdateUser}
			/>
		);

		const passwordInput =
			screen.getByLabelText("Password:");
		fireEvent.change(passwordInput, {
			target: { value: "password123" },
		});
		fireEvent.click(screen.getByText("Save Changes"));

		await waitFor(() => {
			const message = screen.getByText(
				"Error updating profile. Please try again."
			);
			expect(message).not.toBeNull();
		});
	});
});
