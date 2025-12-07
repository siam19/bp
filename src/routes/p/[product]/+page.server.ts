import { createServerPayloadClient, handleApiError } from '$lib/server/api';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { params } = event;
	const client = createServerPayloadClient(event);

	try {
		const product = await client.getShopProduct(params.product);

		if (!product) {
			throw error(404, 'Product not found');
		}

		// Fetch related media (tagged with this product)
		const mediaCards = await client.getShopProductMediaCards(product.id);

		return {
			product,
			relatedMedia: mediaCards.docs
		};
	} catch (err) {
		// If it's already a 404 error, convert to SvelteKit error
		if (err && typeof err === 'object' && 'status' in err && err.status === 404) {
			throw error(404, 'Product not found');
		}
		handleApiError(err);
	}
};
