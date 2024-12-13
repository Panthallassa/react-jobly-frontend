import axios from "axios";

// Create an Axios instance with the correct base URL
const instance = axios.create({
	baseURL:
		process.env.REACT_APP_BASE_URL ||
		"http://localhost:3001", // Use deployment or local URL
});

export default instance;
