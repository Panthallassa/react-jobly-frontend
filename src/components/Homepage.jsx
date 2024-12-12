import React, { useState, useEffect } from "react";
import JobCard from "./JobCard";
import JoblyApi from "../../JoblyApi";

/**
 * Home page component that shows a welcome message if the user is logged in,
 * or a prompt to log in or sign up if the user is not logged in.
 *
 * @param {object} props - The component's props.
 * @param {object} props.currentUser - The current logged-in user.
 * @returns {JSX.Element} The home page JSX.
 */
function Home({ currentUser }) {
	const [appliedJobs, setAppliedJobs] = useState([]);

	// Fetch job details when the component mounts
	useEffect(() => {
		async function fetchAppliedJobs() {
			if (currentUser?.applications?.length > 0) {
				try {
					const jobs = await Promise.all(
						currentUser.applications.map(
							(jobId) => JoblyApi.getJob(jobId) // Assume getJob fetches job details by ID
						)
					);

					setAppliedJobs(jobs);
				} catch (err) {
					console.error(
						"Error fetching applied jobs:",
						err
					);
				}
			}
		}

		fetchAppliedJobs();
	}, [currentUser]);

	return (
		<div>
			{currentUser ? (
				<div>
					<h1>Welcome back, {currentUser.username}!</h1>

					<h2>Your Applied Jobs</h2>
					{appliedJobs.length > 0 ? (
						<div className='AppliedJobs'>
							{appliedJobs.map((job) => (
								<JobCard
									key={job.id} // Unique key for each job
									id={job.id}
									title={job.title}
									salary={job.salary}
									companyName={job.company.name}
									applied={true} // Since these are applied jobs
									username={currentUser.username} // Pass the username for JobCard logic
								/>
							))}
						</div>
					) : (
						<p>Go apply to some jobs!</p>
					)}
				</div>
			) : (
				<h1>
					Welcome to Jobly! Please log in or sign up.
				</h1> /* Prompt for not logged-in user */
			)}
		</div>
	);
}

export default Home;
