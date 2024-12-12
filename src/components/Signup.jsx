import React from "react";
import { useNavigate } from "react-router-dom";
import SignupForm from "./SignupForm";
import axios from "axios";

/**
 * Signup Component
 *
 * This component renders the signup page, including a heading and a prompt for the user
 * to create an account. It also includes the SignupForm component to handle the signup functionality.
 *
 * @returns {JSX.Element} The JSX layout for the Signup page.
 */
function Signup() {
	const navigate = useNavigate(); // Initialize the navigate hook

	// Handle the signup process and redirect
	const handleSignup = async (formData) => {
		try {
			// Make API call to your backend to register the user
			const response = await axios.post(
				"http://localhost:3001/api/users/auth/register", // Update with your actual endpoint
				formData
			);

			const { token } = response.data;

			navigate("/"); // Redirect to the home page after successful signup
		} catch (err) {
			console.error("Signup Failed:", err);
		}
	};

	return (
		<div>
			<h1>Signup</h1>
			<p>Create an account to get started.</p>
			<SignupForm signup={handleSignup} />
			{/* Pass the signup function to SignupForm as a prop */}
		</div>
	);
}

export default Signup;
