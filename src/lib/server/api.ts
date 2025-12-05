/**
 * Server-Side API Utilities
 * Wrapper for Payload CMS client with server-side fetch and error handling
 */

import { createPayloadClient } from '$lib/api/payload';
import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

/**
 * Create a Payload client with server-side fetch from SvelteKit event
 * Use this in +page.server.ts load functions
 * @param {RequestEvent} event - SvelteKit request event
 * @returns Payload client configured with server fetch
 */
export function createServerPayloadClient(event: RequestEvent) {
	return createPayloadClient({
		fetch: event.fetch
	});
}

/**
 * Error handler for API calls in load functions
 * Throws SvelteKit error with appropriate status code
 * @param {unknown} err - Error object
 * @param {number} fallbackStatus - Fallback HTTP status code (default: 500)
 */
export function handleApiError(err: unknown, fallbackStatus: number = 500): never {
	console.error('API Error:', err);

	if (err && typeof err === 'object' && 'status' in err) {
		const status = typeof err.status === 'number' ? err.status : fallbackStatus;
		const message =
			'message' in err && typeof err.message === 'string'
				? err.message
				: 'An error occurred while fetching data';
		throw error(status, message);
	}

	throw error(fallbackStatus, 'An unexpected error occurred');
}

/**
 * Safe API call wrapper with automatic error handling
 * Returns null on error instead of throwing
 * @param {Promise<T>} promise - API promise to execute
 * @returns Promise that resolves to data or null
 */
export async function safeApiCall<T>(promise: Promise<T>): Promise<T | null> {
	try {
		return await promise;
	} catch (err) {
		console.error('Safe API call failed:', err);
		return null;
	}
}
