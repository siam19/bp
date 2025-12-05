/**
 * String Utility Functions
 */

/**
 * Generate a random alphanumeric Order ID
 * Format: BP-XXXXXXXX (8 uppercase alphanumeric characters)
 * @returns {string} Generated order ID
 */
export function generateOrderId(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let id = 'BP-';
	for (let i = 0; i < 8; i++) {
		id += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return id;
}

/**
 * Truncate text to a specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
export function truncate(text: string, maxLength: number = 50): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength - 3) + '...';
}
