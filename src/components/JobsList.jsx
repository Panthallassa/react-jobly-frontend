import React, { useState, useEffect } from "react";
import JoblyApi from "../../JoblyApi";
import JobCard from "./JobCard";
/**
 * JobsList Component
 * Displays a list of jobs available for application.
 *
 * @param {object} props - The component's props.
 * @param {array} props.jobs - Array of job objects.
 * @param {string} props.username - Current logged-in user's username.
 * @param {array} props.appliedJobIds - IDs of jobs the user has already applied to.
 * @returns {JSX.Element} List of JobCard components.
 */

function JobsList({ username, appliedJobIds }) {
	const [jobs, setJobs] = useState([]); // State for the list of jobs
	const [searchTerm, setSearchTerm] = useState(""); // State for the search input
	const [isLoading, setIsLoading] = useState(true); // State for loading status

	/**
	 * Fetches the list of jobs from the Jobly API on initial load.
	 *
	 * This useEffect hook runs once when the component is first mounted and
	 * fetches the jobs list from the JoblyApi. It then updates the state
	 * with the fetched jobs and sets the loading state to false.
	 */
	useEffect(() => {
		async function fetchJobs() {
			try {
				const jobs = await JoblyApi.getJobs(); // Fetch jobs from API
				setJobs(jobs); // Update the jobs state with fetched data
			} catch (err) {
				console.error("Error fetching jobs:", err); // Log any errors
			} finally {
				setIsLoading(false); // Set loading state to false once fetch is complete
			}
		}
		fetchJobs(); // Call the fetchJobs function
	}, []);

	/**
	 * Handles the search form submission.
	 *
	 * This function is called when the user submits the search form. It uses the
	 * search term entered by the user to fetch the filtered list of jobs
	 * from the Jobly API.
	 *
	 * @param {object} evt - The form submission event.
	 */
	async function handleSearch(evt) {
		evt.preventDefault(); // Prevent the default form submission behavior
		setIsLoading(true); // Set loading state to true while fetching
		try {
			const jobs = await JoblyApi.getJobs(searchTerm); // Fetch filtered jobs based on search term
			setJobs(jobs); // Update the jobs state with the search results
		} catch (err) {
			console.error("Error searching jobs:", err); // Log any errors
		} finally {
			setIsLoading(false); // Set loading state to false once fetch is complete
		}
	}

	// Display a loading message while the jobs are being fetched
	if (isLoading) return <p>Loading...</p>;

	return (
		<div className='JobsList'>
			{/* Search form */}
			<form onSubmit={handleSearch}>
				<input
					type='text'
					placeholder='Search jobs...'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
				/>
				<button type='submit'>Search</button>
			</form>

			{/* Render the list of jobs or a message if no jobs are found */}
			{jobs.length ? (
				jobs.map((job) => (
					<JobCard
						key={job.id}
						job={job}
						id={job.id}
						title={job.title}
						salary={job.salary}
						companyName={job.companyName}
						applied={appliedJobIds.includes(job.id)}
						username={username}
					/> // Render each job as a JobCard
				))
			) : (
				<p>No jobs found.</p> // Display message if no jobs match the search
			)}
		</div>
	);
}

export default JobsList;
