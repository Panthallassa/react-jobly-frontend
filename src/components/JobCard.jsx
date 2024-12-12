import React, { useState } from "react";
import JoblyApi from "../../JoblyApi";

/**
 * JobCard component displays individual job details.
 *
 * Props:
 * - job: An object containing job details such as title, company, salary, equity, and description.
 *
 * This component is reusable in both the job listing page and the company detail page.
 */
function JobCard({
	id,
	title,
	salary,
	companyName,
	applied,
	username,
	hideCompanyName = false, // Hide company name if JobCard is rendered with the CompanyDetail component
}) {
	const [hasApplied, setHasApplied] = useState(applied);

	const handleApply = async () => {
		console.log("Current user:", username);

		if (!username) {
			console.error("Cannot apply: username is missing.");
			return;
		}

		if (hasApplied) return; // Prevent multiple applications

		try {
			await JoblyApi.applyToJob(username, id);
			setHasApplied(true); // Update state to reflect the application
		} catch (err) {
			console.error("Error applying to job:", err);
		}
	};
	return (
		<div className='job-card'>
			<h3>{title}</h3>
			{!hideCompanyName && <p>Company: {companyName}</p>}
			<p>Salary: {salary ? `$${salary}` : "N/A"}</p>
			<button onClick={handleApply} disabled={hasApplied}>
				{hasApplied ? "Applied" : "Apply"}
			</button>
		</div>
	);
}

export default JobCard;
