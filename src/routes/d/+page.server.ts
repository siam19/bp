import { payloadClient } from '$lib/api/payload';
import type { PageServerLoad } from './$types';
import type { Drop, MediaAsset } from '$lib/types';

export const load: PageServerLoad = async () => {
	const drops = await payloadClient.listDrops({
		query: {
			sort: '-release_date',
			depth: 1,
			limit: 100
		}
	});

	// Transform to DropCardData
	const dropCards = drops.docs.map((drop) => ({
		id: drop.id,
		slug: drop.slug,
		name: drop.name,
		status: drop.status,
		release_date: drop.release_date,
		end_date: drop.end_date,
		banner: drop.assets?.banners?.[0] ?? null
	}));

	return {
		drops: dropCards
	};
};
