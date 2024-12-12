import React from "react";
import { describe, it, vi, expect } from "vitest";
import {
	screen,
	fireEvent,
	waitFor,
} from "@testing-library/react";
import { renderWithRouter } from "./testCommon";
import AllJobsPage from "./AllJobsPage";

// Mock global fetch function
global.fetch = vi.fn();

describe("AllJobsPage Component", () => {
	const mockJobs = [
		{ id: 1, title: "Software Engineer" },
		{ id: 2, title: "Product Manager" },
		{ id: 3, title: "Data Scientist" },
	];

	beforeEach(() => {
		// Set a default implementation for fetch to avoid undefined mocks
		fetch.mockImplementation((url) => {
			if (url.includes("?search=Engineer")) {
				return Promise.resolve({
					ok: true,
					json: () =>
						Promise.resolve(
							mockJobs.filter((job) =>
								job.title.includes("Engineer")
							)
						),
				});
			}
			if (url === "/api/jobs") {
				return Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockJobs),
				});
			}
			return Promise.reject(
				new Error("Unhandled fetch call")
			);
		});
	});

	afterEach(() => {
		fetch.mockClear();
	});

	// Smoke test
	it("renders without crashing (smoke test)", () => {
		renderWithRouter(<AllJobsPage />);
		expect(
			screen.getByPlaceholderText("Search jobs...")
		).toBeTruthy();
	});

	// Test: Fetches jobs on initial render
	it("fetches jobs on initial render", async () => {
		renderWithRouter(<AllJobsPage />);

		await waitFor(() => {
			expect(fetch).toHaveBeenCalledWith("/api/jobs");
		});
	});

	// Test: Fetches jobs based on search term
	it("fetches jobs based on search term", async () => {
		renderWithRouter(<AllJobsPage />);

		const searchInput = screen.getByPlaceholderText(
			"Search jobs..."
		);
		fireEvent.change(searchInput, {
			target: { value: "Engineer" },
		});

		await waitFor(() => {
			expect(fetch).toHaveBeenCalledWith(
				"/api/jobs?search=Engineer"
			);
		});
	});

	// Test: Handles fetch errors gracefully
	it("handles fetch errors gracefully", async () => {
		fetch.mockRejectedValueOnce(
			new Error("Failed to fetch")
		);

		renderWithRouter(<AllJobsPage />);

		await waitFor(() => {
			expect(
				screen.queryByText("No jobs found.")
			).toBeTruthy();
		});
	});

	// Test: Displays no jobs found message when API returns an empty list
	it("displays no jobs found message when no jobs are returned", async () => {
		fetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve([]),
		});

		renderWithRouter(<AllJobsPage />);

		await waitFor(() => {
			expect(
				screen.queryByText("No jobs found.")
			).toBeTruthy();
		});
	});
});
