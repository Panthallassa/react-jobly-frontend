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
import JobCard from "./JobCard";
import {
	renderWithRouter,
	resetTestDatabase,
} from "./testCommon";
import JoblyApi from "../../JoblyApi";

// Mock the JoblyApi
vi.mock("../../JoblyApi");

describe("JobCard Component", () => {
	const mockJob = {
		id: 1,
		title: "Software Engineer",
		salary: 120000,
		companyName: "TechCorp",
		applied: false,
	};
	const mockUsername = "testuser";

	beforeEach(async () => {
		vi.clearAllMocks(); // Clear mock calls before each test
		await resetTestDatabase(); // Reset the test database
	});

	// Smoke test: Ensure the component renders without crashing
	it("renders without crashing (smoke test)", () => {
		renderWithRouter(
			<JobCard
				id={mockJob.id}
				title={mockJob.title}
				salary={mockJob.salary}
				companyName={mockJob.companyName}
				applied={mockJob.applied}
				username={mockUsername}
			/>
		);
		if (!screen.getByText("Software Engineer")) {
			throw new Error("Job title not rendered");
		}
		if (!screen.getByText("Company: TechCorp")) {
			throw new Error("Company name not rendered");
		}
		if (!screen.getByText("Salary: $120000")) {
			throw new Error("Salary not rendered");
		}
	});

	// Test: Displays correct job details
	it("displays correct job details", () => {
		renderWithRouter(
			<JobCard
				id={mockJob.id}
				title={mockJob.title}
				salary={mockJob.salary}
				companyName={mockJob.companyName}
				applied={mockJob.applied}
				username={mockUsername}
			/>
		);

		if (!screen.getByText("Software Engineer")) {
			throw new Error("Job title not rendered");
		}
		if (!screen.getByText("Company: TechCorp")) {
			throw new Error("Company name not rendered");
		}
		if (!screen.getByText("Salary: $120000")) {
			throw new Error("Salary not rendered");
		}
		if (!screen.getByText("Apply")) {
			throw new Error("Apply button not rendered");
		}
	});

	// Test: Handles apply action and disables button after applying
	it("handles apply action and disables button after applying", async () => {
		JoblyApi.applyToJob.mockResolvedValueOnce(
			"Application successful"
		);

		renderWithRouter(
			<JobCard
				id={mockJob.id}
				title={mockJob.title}
				salary={mockJob.salary}
				companyName={mockJob.companyName}
				applied={false}
				username={mockUsername}
			/>
		);

		const applyButton = screen.getByText("Apply");
		if (applyButton.disabled) {
			throw new Error(
				"Apply button is incorrectly disabled"
			);
		}

		fireEvent.click(applyButton);

		await waitFor(() => {
			if (JoblyApi.applyToJob.mock.calls.length === 0) {
				throw new Error(
					"JoblyApi.applyToJob was not called"
				);
			}
		});

		if (!applyButton.disabled) {
			throw new Error(
				"Apply button not disabled after applying"
			);
		}
		if (applyButton.textContent !== "Applied") {
			throw new Error(
				"Apply button text did not change to 'Applied'"
			);
		}
	});

	// Test: Logs an error if applying without username
	it("logs an error if username is missing", async () => {
		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		renderWithRouter(
			<JobCard
				id={mockJob.id}
				title={mockJob.title}
				salary={mockJob.salary}
				companyName={mockJob.companyName}
				applied={false}
				username={null} // Missing username
			/>
		);

		const applyButton = screen.getByText("Apply");
		fireEvent.click(applyButton);

		await waitFor(() => {
			if (consoleErrorSpy.mock.calls.length === 0) {
				throw new Error(
					"Console error was not called for missing username"
				);
			}
		});

		consoleErrorSpy.mockRestore(); // Clean up the mock
	});

	// Test: Prevents multiple applications
	it("prevents multiple applications", async () => {
		renderWithRouter(
			<JobCard
				id={mockJob.id}
				title={mockJob.title}
				salary={mockJob.salary}
				companyName={mockJob.companyName}
				applied={true} // Already applied
				username={mockUsername}
			/>
		);

		const applyButton = screen.getByText("Applied");
		if (!applyButton.disabled) {
			throw new Error(
				"Apply button is not disabled for already applied job"
			);
		}

		fireEvent.click(applyButton);

		await waitFor(() => {
			if (JoblyApi.applyToJob.mock.calls.length > 0) {
				throw new Error(
					"JoblyApi.applyToJob was incorrectly called again"
				);
			}
		});
	});
});
