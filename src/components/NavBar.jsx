import React from "react";
import { Link } from "react-router-dom";

/**
 * Navigation bar component that displays different options depending on the user's authentication status.
 * Shows links for login/signup if the user is not logged in, or username and logout if they are logged in.
 *
 * @param {object} props - The component's props.
 * @param {object} props.currentUser - The current logged-in user.
 * @param {function} props.logout - The logout function.
 * @returns {JSX.Element} The navigation bar JSX.
 */
function NavBar({ currentUser, logout }) {
	return (
		<nav>
			{currentUser ? (
				<>
					{" "}
					<Link to='/'>Home</Link>
					<Link to='/companies'>Companies</Link>{" "}
					{/* Link to Companies */}
					<Link to='/jobs'>Jobs</Link> {/* Link to Jobs */}
					<Link to='/profile'>Profile</Link>{" "}
					{/* Profile link */}
					<button
						data-testid='logout-button'
						onClick={logout}
					>
						Logout
					</button>{" "}
					{/* Logout button */}
				</>
			) : (
				<>
					<Link to='/login'>Login</Link> {/* Login link */}
					<Link to='/signup'>Sign Up</Link>{" "}
					{/* Signup link */}
				</>
			)}
		</nav>
	);
}

export default NavBar;
