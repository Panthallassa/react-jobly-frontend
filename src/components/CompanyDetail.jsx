import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import JoblyApi from "../../JoblyApi";
import JobCard from "./JobCard";

/**
 * CompanyDetailPage component displays information about a specific company and its available jobs.
 *
 * The company details and jobs are fetched from the backend using the companyId from the URL.
 */
function CompanyDetailPage({
	handleJobApplication,
	appliedJobIds = [], // Default to empty array
	initialCompany,
}) {
	const { handle } = useParams(); // Get the handle from the URL
	const [company, setCompany] = useState(
		initialCompany || null
	); // State to store company details

	useEffect(() => {
		async function fetchCompanyDetails() {
			try {
				const companyRes = await JoblyApi.getCompany(
					handle
				);
				setCompany(companyRes); // Update company details
			} catch (err) {
				console.error(
					"Error fetching company details:",
					err
				);
			}
		}

		if (handle) fetchCompanyDetails(); // Fetch only if handle exists
	}, [handle]); // Effect runs when the companyId changes

	return (
		<div className='company-detail-page'>
			{company && (
				<>
					<h1>{company.name}</h1>{" "}
					{/* Display the company name */}
					<p>{company.description}</p>{" "}
					{/* Display the company description */}
					<h2>Jobs at {company.name}</h2>{" "}
					{/* Display jobs available at the company */}
					<div className='CompanyJobs'>
						{company.jobs?.map((job) => (
							<JobCard
								key={job.id} // Unique key for each job
								id={job.id}
								title={job.title}
								salary={job.salary}
								equity={job.equity}
								company={company}
								applied={appliedJobIds.includes(job.id)} // Check if the job is already applied for
								handleApply={handleJobApplication} // Pass application handler
								hideCompanyName={true}
							/>
						))}
					</div>
					{/* Render jobs for this company */}
				</>
			)}
		</div>
	);
}

export default CompanyDetailPage;
