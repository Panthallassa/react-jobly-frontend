import { useState, useEffect } from "react";

/**
 * Custom Hook for interacting with localStorage
 * @param {string} key - The key to use in localStorage.
 * @param {*} initialValue - The initial value to set if key doesn't exist in localStorage.
 * @returns [storedValue, setStoredValue] - The stored value and a setter function.
 */

function useLocalStorage(key, initialValue = null) {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = localStorage.getItem(key);

			return item ? JSON.parse(item) : initialValue;
		} catch (err) {
			console.error("Error reading from localStorage", err);
			return initialValue;
		}
	});

	useEffect(() => {
		try {
			if (storedValue === null) {
				localStorage.removeItem(key);
			} else {
				localStorage.setItem(
					key,
					JSON.stringify(storedValue)
				);
			}
		} catch (err) {
			console.error("Error writing to localStorage", err);
		}
	}, [key, storedValue]);

	return [storedValue, setStoredValue];
}

export default useLocalStorage;
