import React from "react";
import { Navigate } from "react-router-dom";

/**
 * PrivateRoute component
 * Wraps around components that should only be accessible to authenticated users.
 * @param {object} props - Props including currentUser and children components.
 * @returns {JSX.Element} Protected route or redirect to login.
 */
function PrivateRoute({ currentUser, children }) {
	if (!currentUser) {
		return <Navigate to='/login' replace />;
	}
	return children;
}

export default PrivateRoute;
