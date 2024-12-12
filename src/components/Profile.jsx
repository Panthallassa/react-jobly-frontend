import React, { useState } from "react";

/**
 * Profile Component
 *
 * Allows the logged-in user to view and update their profile information.
 *
 * @param {object} props - The component's props.
 * @param {object} props.currentUser - The current logged-in user.
 * @param {function} props.updateUser - Function to update the user profile.
 * @returns {JSX.Element} The profile form component.
 */

function Profile({ currentUser, updateUser }) {
	const [formData, setFormData] = useState({
		username: currentUser.username || "",
		firstName: currentUser.firstName || "",
		lastName: currentUser.lastName || "",
		email: currentUser.email || "",
		password: "",
	});

	const [message, setMessage] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((fData) => ({
			...fData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { username, ...updateData } = formData;
			await updateUser(updateData);
			setMessage("Profile updated successfully!");
		} catch (error) {
			setMessage(
				"Error updating profile. Please try again."
			);
		}
	};

	return (
		<div>
			<h1>Profile</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor='username'>Username:</label>
				<input
					id='username'
					name='username'
					value={formData.username}
					onChange={handleChange}
					disabled
					autoComplete='current-username'
				/>

				<label htmlFor='firstName'>First Name:</label>
				<input
					id='firstName'
					name='firstName'
					value={formData.firstName}
					onChange={handleChange}
					required
				/>

				<label htmlFor='lastName'>Last Name:</label>
				<input
					id='lastName'
					name='lastName'
					value={formData.lastName}
					onChange={handleChange}
					required
				/>

				<label htmlFor='email'>Email:</label>
				<input
					id='email'
					name='email'
					type='email'
					value={formData.email}
					onChange={handleChange}
					required
				/>

				<label htmlFor='password'>Password:</label>
				<input
					id='password'
					name='password'
					type='password'
					value={formData.password}
					onChange={handleChange}
					placeholder='Enter password to confirm changes'
					required
					autoComplete='current-password'
				/>

				<button type='submit'>Save Changes</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
}

export default Profile;
