import { useState, useEffect } from "react";
import JoblyApi from "../../JoblyApi";

/**
 * Custom hook for managing authentication state.
 * Handles user login, signup, token management, and fetching the current user.
 *
 * @returns {object} The current authentication state and functions for login, signup, and logout.
 */
function useAuth() {
	const [token, setToken] = useState(
		localStorage.getItem("jobly-token") || ""
	);
	const [currentUser, setCurrentUser] = useState(null);

	/**
	 * Fetches the current user based on the stored token.
	 * Triggered when the token state changes.
	 */
	useEffect(() => {
		async function getCurrentUser() {
			if (token) {
				JoblyApi.token = token; // Set the token on the API class
				const user = await JoblyApi.getCurrentUser(
					"username"
				); // Fetch user details
				setCurrentUser(user); // Update current user state
			}
		}
		getCurrentUser(); // Fetch user when token is available
	}, [token]);

	/**
	 * Handles user login and stores the token.
	 *
	 * @param {object} data - The login data (username, password).
	 */
	const login = async (data) => {
		const token = await JoblyApi.login(data); // Fetch token from login
		setToken(token); // Update token state
		localStorage.setItem("jobly-token", token); // Save token to local storage
	};

	/**
	 * Handles user signup and stores the token.
	 *
	 * @param {object} data - The signup data (username, password, etc.).
	 */
	const signup = async (data) => {
		const token = await JoblyApi.signup(data); // Fetch token from signup
		setToken(token); // Update token state
		localStorage.setItem("jobly-token", token); // Save token to local storage
	};

	/**
	 * Handles user logout by clearing the token and current user state.
	 */
	const logout = () => {
		setToken(""); // Clear token state
		setCurrentUser(null); // Clear current user state
		localStorage.removeItem("jobly-token"); // Remove token from local storage
	};

	return { currentUser, token, login, signup, logout };
}

export default useAuth;
