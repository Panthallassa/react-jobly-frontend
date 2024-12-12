import React from "react";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithRouter } from "./testCommon";
import CompanyCard from "./CompanyCard";

/**
 * Test Suite for CompanyCard Component
 *
 * This suite ensures that the CompanyCard component renders correctly
 * and behaves as expected, including:
 * - Proper rendering of company details.
 * - Displaying the logo if provided.
 * - Navigation to the company's detail page.
 */

describe("CompanyCard Component", () => {
	const mockCompany = {
		handle: "test-company",
		name: "Test Company",
		description: "A test company for testing purposes.",
		logoUrl: "http://test.com/logo.png",
	};

	// Smoke test: Ensure the component renders without crashing
	it("renders without crashing (smoke test)", () => {
		renderWithRouter(
			<CompanyCard
				handle={mockCompany.handle}
				name={mockCompany.name}
				description={mockCompany.description}
				logoUrl={mockCompany.logoUrl}
			/>
		);

		expect(screen.getByText("Test Company")).toBeTruthy();
	});

	// Test: Displays company details correctly
	it("displays company details correctly", () => {
		renderWithRouter(
			<CompanyCard
				handle={mockCompany.handle}
				name={mockCompany.name}
				description={mockCompany.description}
				logoUrl={mockCompany.logoUrl}
			/>
		);

		// Check for the company name
		const nameElement = screen.getByText("Test Company");
		expect(nameElement).toBeTruthy();

		// Check for the company description
		const descriptionElement = screen.getByText(
			"A test company for testing purposes."
		);
		expect(descriptionElement).toBeTruthy();

		// Check for the "View Details" link
		const linkElement = screen.getByText("View Details");
		expect(linkElement.textContent).toBe("View Details");
		expect(linkElement.getAttribute("href")).toBe(
			"/companies/test-company"
		);
	});

	// Test: Displays logo if provided
	it("displays logo if provided", () => {
		renderWithRouter(
			<CompanyCard
				handle={mockCompany.handle}
				name={mockCompany.name}
				description={mockCompany.description}
				logoUrl={mockCompany.logoUrl}
			/>
		);

		const logoElement = screen.getByAltText(
			"Test Company logo"
		);
		expect(logoElement).toBeTruthy();
		expect(logoElement.getAttribute("src")).toBe(
			"http://test.com/logo.png"
		);
	});

	// Test: Hides logo if not provided
	it("hides logo if not provided", () => {
		renderWithRouter(
			<CompanyCard
				handle={mockCompany.handle}
				name={mockCompany.name}
				description={mockCompany.description}
			/>
		);

		const logoElement = screen.queryByAltText(
			"Test Company logo"
		);
		expect(logoElement).toBeNull();
	});

	// Test: Renders link to company details
	it("renders link to company details", () => {
		renderWithRouter(
			<CompanyCard
				handle={mockCompany.handle}
				name={mockCompany.name}
				description={mockCompany.description}
			/>
		);

		const linkElement = screen.getByText("View Details");
		expect(linkElement.textContent).toBe("View Details");
		expect(linkElement.getAttribute("href")).toBe(
			"/companies/test-company"
		);
	});
});
