import { createServerPayloadClient, handleApiError } from '$lib/server/api';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { params } = event;
	const client = createServerPayloadClient(event);

	try {
		const products = await client.listProducts({
			query: {
				'where[slug][equals]': params.product,
				depth: 2
			}
		});

		if (products.docs.length === 0) {
			throw error(404, 'Product not found');
		}

		const product = products.docs[0];

		// Fetch related media (tagged with this product)
		const mediaCards = await client.listMediaCards({
			query: {
				'where[tagged_products][contains]': product.id,
				depth: 1
			}
		});

		return {
			product,
			relatedMedia: mediaCards.docs
		};
	} catch (err) {
		// If it's already a 404 error, rethrow it
		if (err && typeof err === 'object' && 'status' in err && err.status === 404) {
			throw err;
		}
		handleApiError(err);
	}
};
