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
import Companies from "./CompanyList";
import CompanyCard from "./CompanyCard";
import JoblyApi from "../../JoblyApi";
import {
	renderWithRouter,
	resetTestDatabase,
} from "./testCommon";

// Mock JoblyApi and CompanyCard
vi.mock("../../JoblyApi");
vi.mock("./CompanyCard", () => ({
	__esModule: true,
	default: ({ name }) => <div>{name}</div>,
}));

describe("Companies Component", () => {
	beforeEach(async () => {
		vi.clearAllMocks(); // Clear mocks before each test
		await resetTestDatabase(); // Reset the test database
	});

	// Smoke test: Ensure the component renders without crashing
	it("renders without crashing (smoke test)", () => {
		renderWithRouter(<Companies />);
		if (!screen.getByText("Loading...")) {
			throw new Error("Search input not rendered");
		}
	});

	// Test: Displays loading message while fetching companies
	it("displays loading message while fetching companies", async () => {
		JoblyApi.getCompanies.mockImplementation(
			() =>
				new Promise((resolve) =>
					setTimeout(() => resolve([]), 500)
				)
		);

		renderWithRouter(<Companies />);
		expect(screen.getByText("Loading...")).toBeTruthy();
		await waitFor(() =>
			expect(screen.queryByText("Loading...")).toBeNull()
		);
	});

	// Test: Displays a list of companies after fetching
	it("displays a list of companies after fetching", async () => {
		JoblyApi.getCompanies.mockResolvedValueOnce([
			{ handle: "company1", name: "Company 1" },
			{ handle: "company2", name: "Company 2" },
		]);

		renderWithRouter(<Companies />);

		await waitFor(() => {
			if (
				!screen.getByText("Company 1") ||
				!screen.getByText("Company 2")
			) {
				throw new Error("Companies not rendered correctly");
			}
		});
	});

	// Test: Displays "No companies found" when no companies match search
	it("displays 'No companies found' when no companies match search", async () => {
		JoblyApi.getCompanies.mockResolvedValueOnce([]);

		renderWithRouter(<Companies />);

		await waitFor(() => {
			if (!screen.getByText("No companies found.")) {
				throw new Error(
					"'No companies found' message not rendered"
				);
			}
		});
	});

	// Test: Filters companies based on search term
	it("filters companies based on search term", async () => {
		JoblyApi.getCompanies.mockResolvedValueOnce([
			{ handle: "company1", name: "Company 1" },
			{ handle: "company2", name: "Company 2" },
		]);

		renderWithRouter(<Companies />);

		// Wait for companies to load
		await waitFor(() => {
			if (
				!screen.getByText("Company 1") ||
				!screen.getByText("Company 2")
			) {
				throw new Error("Companies not loaded correctly");
			}
		});

		// Mock filtered search response
		JoblyApi.getCompanies.mockResolvedValueOnce([
			{ handle: "company1", name: "Company 1" },
		]);

		const searchInput = screen.getByPlaceholderText(
			"Search companies..."
		);
		const searchButton = screen.getByText("Search");

		fireEvent.change(searchInput, {
			target: { value: "Company 1" },
		});
		fireEvent.click(searchButton);

		await waitFor(() => {
			if (
				!screen.getByText("Company 1") ||
				screen.queryByText("Company 2")
			) {
				throw new Error(
					"Filtered companies not rendered correctly"
				);
			}
		});
	});
});
