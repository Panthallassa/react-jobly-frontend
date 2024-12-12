/**
 * Companies Component
 *
 * This component displays a list of companies fetched from the Jobly API.
 * It includes a search form that allows users to filter the companies by name.
 * The component is responsible for fetching company data, handling search input,
 * and rendering individual company cards.
 *
 * Features:
 * - Displays a search form to filter companies.
 * - Fetches all companies from the Jobly API on initial load.
 * - Filters companies based on the search term provided by the user.
 * - Renders a loading message while the companies are being fetched.
 * - Renders a list of company cards or a "No companies found" message.
 *
 * Usage:
 * Simply include <Companies /> in your component tree to display the list of companies.
 */

import React, { useState, useEffect } from "react";
import JoblyApi from "../../JoblyApi";
import CompanyCard from "./CompanyCard";

/**
 * Companies
 *
 * This component manages the state for the list of companies, the search term,
 * and the loading state. It handles the fetching of companies from the Jobly API
 * and updates the displayed list of companies based on the search term entered by
 * the user.
 *
 * @returns {JSX.Element} The JSX representation of the companies list, search form,
 *                        and loading state.
 */
function Companies() {
	const [companies, setCompanies] = useState([]); // State for the list of companies
	const [searchTerm, setSearchTerm] = useState(""); // State for the search input
	const [isLoading, setIsLoading] = useState(true); // State for loading status

	/**
	 * Fetches the list of companies from the Jobly API on initial load.
	 *
	 * This useEffect hook runs once when the component is first mounted and
	 * fetches the companies list from the JoblyApi. It then updates the state
	 * with the fetched companies and sets the loading state to false.
	 */
	useEffect(() => {
		async function fetchCompanies() {
			try {
				const companies = await JoblyApi.getCompanies(); // Fetch companies from API
				setCompanies(companies); // Update the companies state with fetched data
			} catch (err) {
				console.error("Error fetching companies:", err); // Log any errors
			} finally {
				setIsLoading(false); // Set loading state to false once fetch is complete
			}
		}
		fetchCompanies(); // Call the fetchCompanies function
	}, []);

	/**
	 * Handles the search form submission.
	 *
	 * This function is called when the user submits the search form. It uses the
	 * search term entered by the user to fetch the filtered list of companies
	 * from the Jobly API.
	 *
	 * @param {object} evt - The form submission event.
	 */
	async function handleSearch(evt) {
		evt.preventDefault(); // Prevent the default form submission behavior

		setIsLoading(true); // Set loading state to true while fetching
		try {
			let companies;
			if (!searchTerm.trim()) {
				// If searchTerm is empty, fetch all companies
				companies = await JoblyApi.getCompanies();
			} else {
				// Otherwise, fetch companies based on the search term
				companies = await JoblyApi.getCompanies(
					searchTerm.trim()
				);
			}
			setCompanies(companies); // Update the companies state with the results
		} catch (err) {
			console.error("Error searching companies:", err); // Log any errors
		} finally {
			setIsLoading(false); // Set loading state to false once fetch is complete
		}
	}

	// Display a loading message while the companies are being fetched
	if (isLoading) return <p>Loading...</p>;

	return (
		<div className='CompanyList'>
			{/* Search form */}
			<form onSubmit={handleSearch}>
				<input
					type='text'
					placeholder='Search companies...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
				/>
				<button type='submit'>Search</button>
			</form>

			{/* Render the list of companies or a message if no companies are found */}
			{companies.length ? (
				companies.map((company) => (
					<CompanyCard key={company.handle} {...company} /> // Render each company as a CompanyCard
				))
			) : (
				<p>No companies found.</p> // Display message if no companies match the search
			)}
		</div>
	);
}

export default Companies;
