import axios from "axios";
import { decodeJWT } from "./src/utils/jwtUtils";
import BASE_URL from "./src/config";

/** API Class.
 *
 * Static class tying together methods used to get/send to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 */

class JoblyApi {
	// the token for interacting with the API will be stored here.
	static token;

	/** Generic method to make an API request.
	 *
	 * @param {string} endpoint - The API endpoint.
	 * @param {object} data - Data to send in the request (for POST/PUT requests).
	 * @param {string} method - HTTP method (GET, POST, PATCH, DELETE).
	 *
	 * @returns {object} - The response data from the API.
	 */
	static async request(
		endpoint,
		data = {},
		method = "get"
	) {
		const url = `${BASE_URL}/${endpoint}`;
		const headers = JoblyApi.token
			? { Authorization: `Bearer ${JoblyApi.token}` }
			: {};

		const params = method === "get" ? data : {};

		try {
			const response = await axios({
				url,
				method,
				data,
				params,
				headers,
			});
			return response.data;
		} catch (err) {
			console.error("API Error:", err.response);
			let message = err.response.data.error.message;
			throw Array.isArray(message) ? message : [message];
		}
	}

	// ============================
	// Individual API Routes
	// ============================

	/** Get details on a company by handle. */
	static async getCompany(handle) {
		const res = await this.request(
			`api/companies/${handle}`
		);
		return res.company;
	}

	/** Get a list of all companies, with optional search filters. */
	static async getCompanies(name = "") {
		const res = await this.request("api/companies", {
			params: name ? { name } : {},
		});
		return res.companies;
	}

	/** Get a list of all jobs, with optional search filters. */
	static async getJobs(name = "") {
		const res = await this.request("api/jobs", {
			params: name ? { name } : {},
		});
		return res.jobs;
	}

	/** Get a job */
	static async getJob(id) {
		try {
			const res = await axios.get(`api/jobs/${id}`);
			return res.data.job; // Assuming API returns a job object
		} catch (err) {
			console.error("Error fetching job:", err);
			throw err; // Re-throw to handle errors in the calling code
		}
	}

	/** Get details on a user by username. */
	static async getUser(username) {
		const res = await this.request(`api/users/${username}`);
		return res.user;
	}

	/** Get details of the current user (from token). */
	static async getCurrentUser() {
		if (!this.token)
			throw new Error(
				"No token available for authentication."
			);
		const { username } = decodeJWT(this.token);
		const res = await this.request(`api/users/${username}`);
		return res.user;
	}

	/** Register a new user. */
	static async register(data) {
		const res = await this.request(
			"api/auth/register",
			data,
			"post"
		);
		return res.token;
	}

	/** Log in an existing user. */
	static async login(data) {
		const res = await this.request(
			"api/auth/token",
			data,
			"post"
		);
		return res.token;
	}

	/** Save user profile updates. */
	static async saveProfile(username, data) {
		try {
			const res = await this.request(
				`api/users/${username}`,
				data,
				"patch"
			);
			return res.user;
		} catch (err) {
			console.error("API Error updating profile", err);
		}
	}

	/** Apply to a job. */
	static async applyToJob(username, jobId) {
		if (!this.token)
			throw new Error("Unauthorized: No token found.");
		try {
			const res = await this.request(
				`api/users/${username}/jobs/${jobId}`,
				{},
				"post"
			);
			return res.applied;
		} catch (err) {
			console.error("Error applying to job:", err);
		}
	}
}

export default JoblyApi;
