import { payloadClient } from '$lib/api/payload';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const drops = await payloadClient.getShopDrops({
		fetch,
		query: {
			limit: 100,
			sort: '-release_date'
		}
	});

	return {
		drops
	};
};
