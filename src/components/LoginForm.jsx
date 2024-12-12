import React, { useState } from "react";

function LoginForm({ login }) {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((fData) => ({ ...fData, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		login(formData);
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				name='username'
				value={formData.username}
				onChange={handleChange}
				placeholder='Username'
				required
				autoComplete='current-username'
			/>
			<input
				name='password'
				type='password'
				value={formData.password}
				onChange={handleChange}
				placeholder='Password'
				required
				autoComplete='current-password'
			/>
			<button type='submit'>Login</button>
		</form>
	);
}

export default LoginForm;
