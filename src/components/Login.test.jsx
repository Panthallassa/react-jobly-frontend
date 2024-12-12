import React from "react";
import {
	describe,
	it,
	expect,
	vi,
	beforeEach,
} from "vitest";
import {
	render,
	screen,
	fireEvent,
	waitFor,
} from "@testing-library/react";
import Login from "./Login";
import {
	MemoryRouter,
	useNavigate,
} from "react-router-dom";
import {
	renderWithRouter,
	resetTestDatabase,
} from "./testCommon";

// Mocking the useNavigate hook and returning the real MemoryRouter
vi.mock("react-router-dom", async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		MemoryRouter: actual.MemoryRouter,
		useNavigate: vi.fn(),
	};
});

describe("Login Component", () => {
	// Before each test, reset the test database to ensure a consistent state.
	beforeEach(async () => {
		await resetTestDatabase();
	});

	// Smoke test: Ensure the component renders without crashing.
	it("renders without crashing (smoke test)", () => {
		renderWithRouter(<Login handleLogin={() => {}} />);

		expect(screen.getByText("Please log in to continue."))
			.to.exist;
	});

	// Test: It should call handleLogin with correct data and navigate on success.
	it("calls handleLogin with correct data and navigates on success", async () => {
		const mockHandleLogin = vi.fn(() => Promise.resolve());
		const mockNavigate = vi.fn();

		useNavigate.mockReturnValue(mockNavigate);

		// Render the Login component with mocked navigate and handleLogin
		renderWithRouter(
			<Login handleLogin={mockHandleLogin} />
		);

		// Fill out the login form and submit
		fireEvent.change(
			screen.getByPlaceholderText("Username"),
			{
				target: { value: "testuser" },
			}
		);
		fireEvent.change(
			screen.getByPlaceholderText("Password"),
			{
				target: { value: "password" },
			}
		);
		fireEvent.click(
			screen.getByRole("button", { name: "Login" })
		);

		// Wait for handleLogin to be called
		await waitFor(() => {
			expect(mockHandleLogin).toHaveBeenCalledWith(
				{ username: "testuser", password: "password" },
				mockNavigate
			);
		});
	});

	// Test: It should handle login errors gracefully.
	it("handles login errors gracefully", async () => {
		const mockHandleLogin = vi.fn(() =>
			Promise.reject(new Error("Login failed"))
		);
		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		renderWithRouter(
			<Login handleLogin={mockHandleLogin} />
		);

		// Fill out the login form and submit
		fireEvent.change(
			screen.getByPlaceholderText("Username"),
			{
				target: { value: "testuser" },
			}
		);
		fireEvent.change(
			screen.getByPlaceholderText("Password"),
			{
				target: { value: "wrongpassword" },
			}
		);
		fireEvent.click(
			screen.getByRole("button", { name: "Login" })
		);

		// Wait for handleLogin to be called and error to be caught
		await waitFor(() => {
			expect(mockHandleLogin).toHaveBeenCalled();
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"Error in loginAction:",
				expect.anything()
			);
		});

		// Clean up mock
		consoleErrorSpy.mockRestore();
	});

	// Test: It should display login prompt correctly.
	it("displays login prompt", () => {
		renderWithRouter(<Login handleLogin={() => {}} />);

		// Assert that the login prompt is displayed on the page
		expect(screen.getByText("Please log in to continue."))
			.to.exist;
	});
});
