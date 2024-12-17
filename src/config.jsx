import axios from "axios";

const api = axios.create({
	baseURL:
		import.meta.env.VITE_BASE_URL ||
		"http://localhost:3001/api", // Use environment variable
});

export default api;
