import { createServerPayloadClient, handleApiError } from '$lib/server/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const client = createServerPayloadClient(event);

	try {
		const productsData = await client.getShopProducts({
			query: { limit: 12, page: 1 }
		});
		return { productsData };
	} catch (err) {
		handleApiError(err);
	}
};
