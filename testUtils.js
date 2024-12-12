import axios from "axios";

jest.mock("axios");

/**
 * Mock axios with default settings for the tests.
 *
 * Provides helper functions to set up mock responses and handle API calls.
 */
const mockAxios = {
	/**
	 * Reset all mocks. Should be called before each test case.
	 */
	reset: () => {
		axios.mockClear();
		axios.get.mockClear();
		axios.post.mockClear();
		axios.put.mockClear();
		axios.patch.mockClear();
		axios.delete.mockClear();
	},

	/**
	 * Mock a successful GET response.
	 *
	 * @param {string} url - The URL to mock.
	 * @param {object} response - The response data.
	 */
	mockGet: (url, response) => {
		axios.get.mockImplementationOnce((reqUrl) =>
			reqUrl === url
				? Promise.resolve({ data: response })
				: Promise.reject(new Error("Unexpected GET URL"))
		);
	},

	/**
	 * Mock a successful POST response.
	 *
	 * @param {string} url - The URL to mock.
	 * @param {object} response - The response data.
	 */
	mockPost: (url, response) => {
		axios.post.mockImplementationOnce((reqUrl) =>
			reqUrl === url
				? Promise.resolve({ data: response })
				: Promise.reject(new Error("Unexpected POST URL"))
		);
	},

	/**
	 * Mock a failed request.
	 *
	 * @param {string} method - The HTTP method ("get", "post", etc.).
	 * @param {string} url - The URL to mock.
	 * @param {Error} error - The error to throw.
	 */
	mockError: (method, url, error) => {
		axios[method].mockImplementationOnce((reqUrl) =>
			reqUrl === url
				? Promise.reject(error)
				: Promise.reject(new Error("Unexpected URL"))
		);
	},
};

export default mockAxios;
