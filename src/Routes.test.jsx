import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "./Routes";

// Mock components
vi.mock("./components/Homepage", () => ({
	default: () => <h1>Mock Homepage</h1>,
}));
vi.mock("./components/CompanyList", () => ({
	default: () => <h1>Mock Companies</h1>,
}));
vi.mock("./components/CompanyDetail", () => ({
	default: () => <h1>Mock Company Detail</h1>,
}));
vi.mock("./components/JobsList", () => ({
	default: () => <h1>Mock Jobs List</h1>,
}));
vi.mock("./components/Login", () => ({
	default: () => <h1>Mock Login</h1>,
}));
vi.mock("./components/Signup", () => ({
	default: () => <h1>Mock Signup</h1>,
}));
vi.mock("./components/Profile", () => ({
	default: () => <h1>Mock Profile</h1>,
}));
vi.mock("./components/PrivateRoute", () => ({
	default: ({ children }) => (
		<div>Mock PrivateRoute: {children}</div>
	),
}));

describe("AppRoutes Component", () => {
	const mockHandleLogin = vi.fn();
	const mockHandleSignup = vi.fn();
	const mockUpdateUser = vi.fn();
	const mockHandleJobApplication = vi.fn();

	const mockCurrentUser = {
		username: "testuser",
		applications: [1, 2],
	};

	/**
	 * Smoke test: Ensure the component renders without crashing.
	 */
	it("renders without crashing (smoke test)", () => {
		render(
			<MemoryRouter
				future={{
					v7_startTransition: true,
					v7_relativeSplatPath: true,
				}}
			>
				<AppRoutes
					handleLogin={mockHandleLogin}
					currentUser={null}
					handleSignup={mockHandleSignup}
					updateUser={mockUpdateUser}
					handleJobApplication={mockHandleJobApplication}
				/>
			</MemoryRouter>
		);
	});

	/**
	 * Tests that the Homepage route renders correctly at "/".
	 */
	it("renders Homepage for '/' route", () => {
		render(
			<MemoryRouter initialEntries={["/"]}>
				<AppRoutes currentUser={null} />
			</MemoryRouter>
		);

		expect(screen.getByText("Mock Homepage")).toBeTruthy();
	});

	/**
	 * Tests that the Companies route renders correctly at "/companies".
	 */
	it("renders Companies for '/companies' route", () => {
		render(
			<MemoryRouter initialEntries={["/companies"]}>
				<AppRoutes currentUser={mockCurrentUser} />
			</MemoryRouter>
		);

		expect(
			screen.getByText(/Mock PrivateRoute/i)
		).toBeTruthy();
		expect(screen.getByText("Mock Companies")).toBeTruthy();
	});

	/**
	 * Tests that the CompanyDetail route renders correctly at "/companies/:handle".
	 */
	it("renders CompanyDetail for '/companies/:handle' route", () => {
		render(
			<MemoryRouter
				initialEntries={["/companies/test-company"]}
			>
				<AppRoutes
					currentUser={mockCurrentUser}
					handleJobApplication={mockHandleJobApplication}
				/>
			</MemoryRouter>
		);

		expect(
			screen.getByText(/Mock PrivateRoute/i)
		).toBeTruthy();
		expect(
			screen.getByText("Mock Company Detail")
		).toBeTruthy();
	});

	/**
	 * Tests that the JobsList route renders correctly at "/jobs".
	 */
	it("renders JobsList for '/jobs' route", () => {
		render(
			<MemoryRouter initialEntries={["/jobs"]}>
				<AppRoutes
					currentUser={mockCurrentUser}
					handleJobApplication={mockHandleJobApplication}
				/>
			</MemoryRouter>
		);

		expect(
			screen.getByText(/Mock PrivateRoute/i)
		).toBeTruthy();
		expect(screen.getByText("Mock Jobs List")).toBeTruthy();
	});

	/**
	 * Tests that the Login route renders correctly at "/login".
	 */
	it("renders Login for '/login' route", () => {
		render(
			<MemoryRouter initialEntries={["/login"]}>
				<AppRoutes handleLogin={mockHandleLogin} />
			</MemoryRouter>
		);

		expect(screen.getByText("Mock Login")).toBeTruthy();
	});

	/**
	 * Tests that the Signup route renders correctly at "/signup".
	 */
	it("renders Signup for '/signup' route", () => {
		render(
			<MemoryRouter initialEntries={["/signup"]}>
				<AppRoutes handleSignup={mockHandleSignup} />
			</MemoryRouter>
		);

		expect(screen.getByText("Mock Signup")).toBeTruthy();
	});

	/**
	 * Tests that the Profile route renders correctly at "/profile".
	 */
	it("renders Profile for '/profile' route", () => {
		render(
			<MemoryRouter initialEntries={["/profile"]}>
				<AppRoutes
					currentUser={mockCurrentUser}
					updateUser={mockUpdateUser}
				/>
			</MemoryRouter>
		);

		expect(
			screen.getByText(/Mock PrivateRoute/i)
		).toBeTruthy();
		expect(screen.getByText("Mock Profile")).toBeTruthy();
	});
});
