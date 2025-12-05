/**
 * Array Utility Functions
 */

/**
 * Fisher-Yates shuffle algorithm for randomizing array order
 * Used for masonry grid randomization
 * @param {T[]} array - Array to shuffle
 * @returns {T[]} New shuffled array (does not mutate original)
 */
export function shuffle<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

/**
 * Interleave two arrays alternately
 * Used for merging products and media cards in masonry grids
 * @param {T[]} array1 - First array
 * @param {U[]} array2 - Second array
 * @returns {(T | U)[]} Interleaved array
 */
export function interleave<T, U>(array1: T[], array2: U[]): (T | U)[] {
	const result: (T | U)[] = [];
	const maxLength = Math.max(array1.length, array2.length);

	for (let i = 0; i < maxLength; i++) {
		if (i < array1.length) result.push(array1[i]);
		if (i < array2.length) result.push(array2[i]);
	}

	return result;
}
