// This test suite verifies the functionality of the Home component using Vitest and React Testing Library.
// The testCommon file provides utilities:
// - renderWithRouter: Wraps the component in a Router context for testing route-related features.

import React from "react";
import { describe, it, expect, vi } from "vitest";
import {
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import Home from "./Homepage";
import { renderWithRouter } from "../components/testCommon";

describe("Home Component", () => {
	// 1. Smoke test: Ensure the component renders without crashing.
	it("renders without crashing (smoke test)", () => {
		render(<Home currentUser={null} />);
	});

	// 2. Displays the welcome message and applied jobs for the logged-in user.
	it("displays the welcome message and applied jobs for the logged-in user", async () => {
		const mockUser = {
			username: "testuser",
			applications: [1, 2],
		};

		const mockJobs = [
			{
				id: 1,
				title: "Conservator, furniture",
				salary: 110000,
				company: { name: "Watson-Davis" },
			},
			{
				id: 2,
				title: "Information officer",
				salary: 200000,
				company: { name: "Hall-Mills" },
			},
		];

		// Mocking JoblyApi.getJob to return the job details
		const mockGetJob = vi.fn((id) =>
			Promise.resolve(mockJobs.find((job) => job.id === id))
		);

		// Render the Home component with the mock user
		renderWithRouter(<Home currentUser={mockUser} />);

		// Wait for the welcome message to appear
		await waitFor(() => {
			expect(
				screen.getByText(
					`Welcome back, ${mockUser.username}!`
				)
			).to.exist;
		});

		// Wait for applied jobs to load and be displayed
		await waitFor(() => {
			mockJobs.forEach((job) => {
				expect(screen.getByText(job.title)).to.exist;
			});
		});
	});

	// 3. Prompts the user to apply for jobs if no jobs are applied.
	it("prompts the user to apply for jobs if no jobs are applied", async () => {
		const mockUser = {
			username: "testuser",
			applications: [],
		};

		// Render the Home component with the mock user
		renderWithRouter(<Home currentUser={mockUser} />);

		// Wait for the message to apply to some jobs
		await waitFor(() => {
			expect(screen.getByText("Go apply to some jobs!")).to
				.exist;
		});
	});

	// 4. Prompts the user to log in or sign up if no user is logged in.
	it("prompts the user to log in or sign up if no user is logged in", async () => {
		// Render the Home component without a current user
		renderWithRouter(<Home currentUser={null} />);

		// Wait for the log in or sign up prompt
		await waitFor(() => {
			expect(
				screen.getByText(
					"Welcome to Jobly! Please log in or sign up."
				)
			).to.exist;
		});
	});
});
