import React, { useState } from "react";

function SignupForm({ signup }) {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		firstName: "",
		lastName: "",
		email: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((fData) => ({ ...fData, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		signup(formData);
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				autocomplete='new-username'
				name='username'
				value={formData.username}
				onChange={handleChange}
				placeholder='Username'
				required
				autoComplete='new-username'
			/>
			<input
				autocomplete='new-password'
				name='password'
				type='password'
				value={formData.password}
				onChange={handleChange}
				placeholder='Password'
				required
				autoComplete='new-password'
			/>
			<input
				name='firstName'
				value={formData.firstName}
				onChange={handleChange}
				placeholder='First Name'
				required
			/>
			<input
				name='lastName'
				value={formData.lastName}
				onChange={handleChange}
				placeholder='Last Name'
				required
			/>
			<input
				name='email'
				type='email'
				value={formData.email}
				onChange={handleChange}
				placeholder='Email'
				required
			/>
			<button type='submit'>SignUp</button>
		</form>
	);
}

export default SignupForm;
