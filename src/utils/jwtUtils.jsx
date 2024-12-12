/**
 * Custom JWT decoding function to extract payload from a JWT.
 * @param {string} token - The JWT string.
 * @returns {object|null} - The decoded payload, or null if decoding fails.
 */
export function decodeJWT(token) {
	try {
		return JSON.parse(atob(token.split(".")[1]));
	} catch (e) {
		console.error("Failed to decode JWT", e);
		return null;
	}
}
