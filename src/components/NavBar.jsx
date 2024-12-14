import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

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
		<nav className='NavBar'>
			{currentUser ? (
				<>
					<NavLink to='/' activeclassname='active'>
						Home
					</NavLink>
					<NavLink to='/companies' activeclassname='active'>
						Companies
					</NavLink>
					<NavLink to='/jobs' activeclassname='active'>
						Jobs
					</NavLink>
					<NavLink to='/profile' activeclassname='active'>
						Profile
					</NavLink>
					<button
						className='logout-button'
						data-testid='logout-button'
						onClick={logout}
					>
						Logout
					</button>
				</>
			) : (
				<>
					<NavLink to='/login' activeclassname='active'>
						Login
					</NavLink>
					<NavLink to='/signup' activeclassname='active'>
						Sign Up
					</NavLink>
				</>
			)}
		</nav>
	);
}

export default NavBar;
