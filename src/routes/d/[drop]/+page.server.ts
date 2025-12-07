import { createServerPayloadClient } from '$lib/server/api';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Drop, MediaCard, ShopMediaCard } from '$lib/types';

export const load: PageServerLoad = async (event) => {
	const { params } = event;
	const { drop: slug } = params;
	const client = createServerPayloadClient(event);

	// 1. Fetch Drop
	const drop = await client.getShopDrop(slug);

	if (!drop) {
		throw error(404, 'Drop not found');
	}

	if (drop.status === 'DRAFT') {
		throw error(404, 'Drop not found');
	}

	// 2. Fetch Related Media
	// Get all product IDs in this drop
	const productIds = (drop.products || [])
		.map((p) => p.id)
		.filter(Boolean);

	let relatedMedia: ShopMediaCard[] = [];

	if (productIds.length > 0) {
		const mediaResponse = await client.getShopMediaCards({
			query: {
				'where[tagged_products][in]': productIds.join(','),
				limit: 20
			}
		});
		relatedMedia = mediaResponse.docs;
	}

	return {
		drop,
		relatedMedia
	};
};
