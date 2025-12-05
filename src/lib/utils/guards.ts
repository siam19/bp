/**
 * Type Guard Utilities
 * Runtime type checking for Payload CMS response data
 */

import type { Product, MediaAsset, Variant } from '$lib/types';

/**
 * Check if a value is a populated Product object (not just an ID string)
 * @param {unknown} value - Value to check
 * @returns {boolean} True if value is a Product object
 */
export function isProduct(value: unknown): value is Product {
	return (
		typeof value === 'object' &&
		value !== null &&
		'id' in value &&
		'name' in value &&
		'price' in value &&
		'images' in value
	);
}

/**
 * Check if a value is a populated MediaAsset object (not just an ID string)
 * @param {unknown} value - Value to check
 * @returns {boolean} True if value is a MediaAsset object
 */
export function isMediaAsset(value: unknown): value is MediaAsset {
	return (
		typeof value === 'object' &&
		value !== null &&
		'id' in value &&
		('url' in value || 'filename' in value)
	);
}

/**
 * Check if a value is a populated Variant object (not just an ID string)
 * @param {unknown} value - Value to check
 * @returns {boolean} True if value is a Variant object
 */
export function isVariant(value: unknown): value is Variant {
	return (
		typeof value === 'object' &&
		value !== null &&
		'id' in value &&
		'size' in value &&
		'stock_count' in value
	);
}

/**
 * Extract URL from MediaAsset, handling both populated objects and ID strings
 * @param {string | MediaAsset | null | undefined} media - Media reference
 * @returns {string | null} URL if available, null otherwise
 */
export function getMediaUrl(media: string | MediaAsset | null | undefined): string | null {
	if (!media) return null;
	if (typeof media === 'string') return null; // Just an ID, not populated
	if (isMediaAsset(media)) return media.url || null;
	return null;
}

/**
 * Extract thumbnail URL from MediaAsset sizes
 * @param {MediaAsset} media - Media asset
 * @returns {string | null} Thumbnail URL if available
 */
export function getThumbnailUrl(media: MediaAsset): string | null {
	return media.sizes?.thumbnail?.url || media.thumbnailURL || media.url || null;
}

/**
 * Extract card-sized URL from MediaAsset sizes
 * @param {MediaAsset} media - Media asset
 * @returns {string | null} Card-sized URL if available
 */
export function getCardUrl(media: MediaAsset): string | null {
	return media.sizes?.card?.url || media.url || null;
}
