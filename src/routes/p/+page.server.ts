import { createServerPayloadClient } from '$lib/server/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const client = createServerPayloadClient(event);

	const products = await client.listProducts({
		query: {
			'where[status][equals]': 'AVAILABLE',
			depth: 1,
			limit: 100,
			sort: '-createdAt'
		}
	});

	return {
		products: products.docs
	};
};
