/**
 * AppRoutes Component
 *
 * This component handles the routing for the React Jobly application using React Router v6.
 * It defines the various routes available in the application and the components
 * that should be rendered for each route.
 *
 * Routes defined:
 * - `/`             → Renders the Homepage component.
 * - `/companies`    → Renders the Companies component to display a list of all companies.
 * - `/companies/:handle` → Renders the CompanyDetail component to show details for a specific company.
 * - `/jobs`         → Renders the Jobs component to display a list of all available jobs.
 * - `/login`        → Renders the Login component for user authentication.
 * - `/signup`       → Renders the Signup component for creating a new user account.
 * - `/profile`      → Renders the Profile component for viewing and updating user profile details.
 *
 * Usage:
 * Simply include <AppRoutes /> in your main App component to enable these routes.
 */

import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Companies from "./components/CompanyList";
import CompanyDetail from "./components/CompanyDetail";
import JobsList from "./components/JobsList";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";

/**
 * AppRoutes
 * This component defines the various routes available in the application
 * and applies the PrivateRoute component to protect specific routes.
 *
 * @param {object} props - The component's props.
 * @param {object} props.currentUser - The current logged-in user.
 * @returns {JSX.Element} The set of defined routes for the Jobly application.
 */
function AppRoutes({
	handleLogin,
	currentUser,
	handleSignup,
	updateUser,
	handleJobApplication,
}) {
	return (
		<Routes>
			{/* Homepage route */}
			<Route
				path='/'
				element={<Homepage currentUser={currentUser} />}
			/>

			{/* Companies route (list all companies) */}
			<Route
				path='/companies'
				element={
					<PrivateRoute currentUser={currentUser}>
						<Companies />
					</PrivateRoute>
				}
			/>

			{/* Company details route (show details for a specific company) */}
			<Route
				path='/companies/:handle'
				element={
					<PrivateRoute currentUser={currentUser}>
						<CompanyDetail
							currentUser={currentUser}
							handleJobApplication={handleJobApplication}
						/>
					</PrivateRoute>
				}
			/>

			{/* Jobs route (list all available jobs) */}
			<Route
				path='/jobs'
				element={
					<PrivateRoute currentUser={currentUser}>
						<JobsList
							username={currentUser?.username}
							handleJobApplication={handleJobApplication}
							appliedJobIds={
								currentUser?.applications || []
							}
						/>
					</PrivateRoute>
				}
			/>

			{/* Login route (user authentication) */}
			<Route
				path='/login'
				element={<Login handleLogin={handleLogin} />}
			/>

			{/* Signup route (new user registration) */}
			<Route
				path='/signup'
				element={<Signup handleSignup={handleSignup} />}
			/>

			{/* Profile route (user profile management) */}
			<Route
				path='/profile'
				element={
					<PrivateRoute currentUser={currentUser}>
						<Profile
							currentUser={currentUser}
							updateUser={updateUser}
						/>
					</PrivateRoute>
				}
			/>
		</Routes>
	);
}

export default AppRoutes;
