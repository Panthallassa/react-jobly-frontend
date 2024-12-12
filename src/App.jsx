import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import AppRoutes from "./Routes";
import useLocalStorage from "./hooks/useLocalStorage";
import "./App.css";
import JoblyApi from "../JoblyApi";
import { decodeJWT } from "./utils/jwtUtils";

/**
 * Main application component that handles the routing, user authentication,
 * and renders the necessary components based on the authentication state.
 *
 * @returns {JSX.Element} The main app layout including the navigation bar and routes.
 */

/** Key for storing token in localStorage */
const TOKEN_STORAGE_KEY = "jobly-token";

function App() {
	const [token, setToken] = useLocalStorage(
		TOKEN_STORAGE_KEY
	);
	const [currentUser, setCurrentUser] = useState(null);

	// Load user info when app loads or when token changes
	useEffect(() => {
		async function loadUserInfo() {
			if (token) {
				try {
					const { username } = decodeJWT(token);
					JoblyApi.token = token; // Set token in API helper
					const user = await JoblyApi.getCurrentUser(
						username
					);
					setCurrentUser({
						...user,
						applications: user.applications || [], // Default to an empty array if not provided
					});
				} catch (err) {
					console.error("Error loading user info:", err);
					setCurrentUser(null);
				}
			}
		}
		loadUserInfo();
	}, [token]);

	// Handle user login
	async function handleLogin(formData, navigate) {
		try {
			const { username, password } = formData;
			const token = await JoblyApi.login({
				username,
				password,
			});
			console.log("Token after login:", token);
			setToken(token);
			JoblyApi.token = token;
			const user = await JoblyApi.getUser(username);
			setCurrentUser(user);
			navigate("/");
		} catch (err) {
			console.error("Error logging in", err);
		}
	}

	// Handle user signup
	async function handleSignup(signupData) {
		try {
			const token = await JoblyApi.signup(signupData);
			setToken(token);
		} catch (err) {
			console.error("Error signing up", err);
		}
	}

	// Handle user logout
	function handleLogout() {
		setToken(null);
		setCurrentUser(null);
	}

	// Handle user update
	async function updateUser(updatedData) {
		try {
			const updatedUser = await JoblyApi.saveProfile(
				currentUser.username,
				updatedData
			);
			setCurrentUser(updatedUser);
		} catch (err) {
			console.error("Error updating profile:", err);
		}
	}

	// Handle job application
	async function handleJobApplication(jobId) {
		try {
			await JoblyApi.applyToJob(
				currentUser.username,
				jobId
			);
			setCurrentUser((user) => ({
				...user,
				applications: [...user.applications, jobId], // Add the job ID to applications
			}));
		} catch (err) {
			console.error("Error applying to job:", err);
		}
	}

	return (
		<BrowserRouter
			future={{
				v7_startTransition: true,
				v7_relativeSplatPath: true,
			}}
		>
			<NavBar
				logout={handleLogout}
				currentUser={currentUser}
			/>

			<AppRoutes
				handleLogin={handleLogin}
				handleSignup={handleSignup}
				currentUser={currentUser}
				updateUser={updateUser}
				handleJobApplication={handleJobApplication}
			/>
		</BrowserRouter>
	);
}

export default App;
