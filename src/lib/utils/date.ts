/**
 * Date Utility Functions
 */

export interface CountdownResult {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	isExpired: boolean;
}

/**
 * Calculate countdown from now to a target date
 * @param {string} targetDate - ISO date string
 * @returns {CountdownResult} Object with days, hours, minutes, seconds, and isExpired flag
 */
export function calculateCountdown(targetDate: string): CountdownResult {
	const now = new Date().getTime();
	const target = new Date(targetDate).getTime();
	const difference = target - now;

	if (difference <= 0) {
		return {
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
			isExpired: true
		};
	}

	const days = Math.floor(difference / (1000 * 60 * 60 * 24));
	const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((difference % (1000 * 60)) / 1000);

	return {
		days,
		hours,
		minutes,
		seconds,
		isExpired: false
	};
}

/**
 * Format a date string to a locale-aware readable format
 * @param {string} dateString - ISO date string
 * @param {string} locale - Locale string (default: 'en-US')
 * @returns {string} Formatted date string
 */
export function formatDate(dateString: string, locale: string = 'en-US'): string {
	const date = new Date(dateString);
	return date.toLocaleDateString(locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}
