import { payloadClient } from '$lib/api/payload';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Drop, MediaCard } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	const { drop: slug } = params;

	// 1. Fetch Drop
	const drops = await payloadClient.listDrops({
		query: {
			'where[slug][equals]': slug,
			depth: 2, // Need products and their images
			limit: 1
		}
	});

	if (!drops.docs.length) {
		throw error(404, 'Drop not found');
	}

	const drop = drops.docs[0];

	if (drop.status === 'DRAFT') {
		throw error(404, 'Drop not found');
	}

	// 2. Fetch Related Media
	// Get all product IDs in this drop
	const productIds = (drop.products || [])
		.map((p) => (typeof p === 'string' ? p : p.id))
		.filter(Boolean);

	let relatedMedia: MediaCard[] = [];

	if (productIds.length > 0) {
		const mediaResponse = await payloadClient.listMediaCards({
			query: {
				'where[tagged_products][in]': productIds.join(','),
				depth: 1,
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
