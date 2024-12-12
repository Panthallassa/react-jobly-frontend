import React from "react";
import {
	describe,
	it,
	vi,
	expect,
	beforeEach,
} from "vitest";
import {
	screen,
	fireEvent,
	waitFor,
} from "@testing-library/react";
import JobsList from "./JobsList";
import JoblyApi from "../../JoblyApi";
import {
	renderWithRouter,
	resetTestDatabase,
} from "./testCommon";

// Mock the JoblyApi
vi.mock("../../JoblyApi");

describe("JobsList Component", () => {
	const mockJobs = [
		{
			id: 1,
			title: "Software Engineer",
			salary: 120000,
			companyName: "TechCorp",
		},
		{
			id: 2,
			title: "Data Scientist",
			salary: 130000,
			companyName: "DataCo",
		},
	];
	const mockUsername = "testuser";
	const mockAppliedJobIds = [1];

	beforeEach(async () => {
		vi.clearAllMocks(); // Clear mock calls before each test
		await resetTestDatabase(); // Reset the test database
	});

	// Smoke test: Ensure the component renders without crashing
	it("renders without crashing (smoke test)", async () => {
		JoblyApi.getJobs.mockResolvedValue(mockJobs); // Mock the API response
		renderWithRouter(
			<JobsList
				username={mockUsername}
				appliedJobIds={mockAppliedJobIds}
			/>
		);

		// Wait for the component to finish loading
		await waitFor(() => {
			expect(
				screen.getByText("Software Engineer")
			).toBeTruthy();
			expect(
				screen.getByText("Data Scientist")
			).toBeTruthy();
		});
	});

	// Test: Displays the loading message while fetching jobs
	it("displays loading message while fetching jobs", () => {
		JoblyApi.getJobs.mockResolvedValue(mockJobs); // Mock the API response
		renderWithRouter(
			<JobsList
				username={mockUsername}
				appliedJobIds={mockAppliedJobIds}
			/>
		);
		expect(screen.getByText("Loading...")).toBeTruthy(); // Assert loading message
	});

	// Test: Displays jobs when API call is successful
	it("displays jobs fetched from the API", async () => {
		JoblyApi.getJobs.mockResolvedValue(mockJobs); // Mock the API response
		renderWithRouter(
			<JobsList
				username={mockUsername}
				appliedJobIds={mockAppliedJobIds}
			/>
		);

		// Wait for jobs to load
		await waitFor(() => {
			expect(
				screen.getByText("Software Engineer")
			).toBeTruthy();
			expect(
				screen.getByText("Data Scientist")
			).toBeTruthy();
		});
	});

	// Test: Displays 'No jobs found' message when no jobs are returned
	it("displays 'No jobs found' when no jobs are fetched", async () => {
		JoblyApi.getJobs.mockResolvedValue([]); // Mock an empty API response
		renderWithRouter(
			<JobsList
				username={mockUsername}
				appliedJobIds={mockAppliedJobIds}
			/>
		);

		// Wait for the component to finish loading
		await waitFor(() => {
			expect(
				screen.getByText("No jobs found.")
			).toBeTruthy();
		});
	});

	// Test: Handles the search functionality correctly
	it("fetches and displays jobs based on search term", async () => {
		const searchResults = [
			{
				id: 3,
				title: "Frontend Developer",
				salary: 110000,
				companyName: "WebCorp",
			},
		];

		JoblyApi.getJobs
			.mockResolvedValueOnce(mockJobs) // Mock initial API response
			.mockResolvedValueOnce(searchResults); // Mock search API response

		renderWithRouter(
			<JobsList
				username={mockUsername}
				appliedJobIds={mockAppliedJobIds}
			/>
		);

		// Wait for the initial jobs to load
		await waitFor(() => {
			expect(
				screen.getByText("Software Engineer")
			).toBeTruthy();
		});

		// Simulate entering a search term and submitting the form
		fireEvent.change(
			screen.getByPlaceholderText("Search jobs..."),
			{
				target: { value: "Frontend" },
			}
		);
		fireEvent.click(screen.getByText("Search"));

		// Wait for the search results to load
		await waitFor(() => {
			expect(
				screen.getByText("Frontend Developer")
			).toBeTruthy();
			expect(
				screen.queryByText("Software Engineer")
			).toBeNull();
		});
	});

	// Test: Logs an error if fetching jobs fails
	it("logs an error if fetching jobs fails", async () => {
		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});
		JoblyApi.getJobs.mockRejectedValueOnce(
			new Error("API error")
		);

		renderWithRouter(
			<JobsList
				username={mockUsername}
				appliedJobIds={mockAppliedJobIds}
			/>
		);

		// Wait for the error to be logged
		await waitFor(() => {
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"Error fetching jobs:",
				expect.any(Error)
			);
		});

		consoleErrorSpy.mockRestore(); // Clean up the mock
	});
});
