import React from "react";
import { render } from "@testing-library/react";
import {
	MemoryRouter,
	Routes,
	Route,
} from "react-router-dom";
import { describe, it, expect } from "vitest";
import PrivateRoute from "./PrivateRoute";

describe("PrivateRoute Component", () => {
	// Test: Redirects unauthenticated users to the login page
	it("redirects to /login if no currentUser is provided", () => {
		const { getByText } = render(
			<MemoryRouter initialEntries={["/protected"]}>
				<Routes>
					<Route
						path='/protected'
						element={
							<PrivateRoute currentUser={null}>
								<div>Protected Content</div>
							</PrivateRoute>
						}
					/>
					<Route
						path='/login'
						element={<div>Login Page</div>}
					/>
				</Routes>
			</MemoryRouter>
		);

		expect(getByText("Login Page")).toBeTruthy();
	});

	// Test: Renders children if currentUser is provided
	it("renders children if currentUser is provided", () => {
		const { getByText } = render(
			<MemoryRouter initialEntries={["/protected"]}>
				<Routes>
					<Route
						path='/protected'
						element={
							<PrivateRoute
								currentUser={{ username: "testuser" }}
							>
								<div>Protected Content</div>
							</PrivateRoute>
						}
					/>
				</Routes>
			</MemoryRouter>
		);

		expect(getByText("Protected Content")).toBeTruthy();
	});
});
