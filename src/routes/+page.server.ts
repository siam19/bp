import { payloadClient } from '$lib/api/payload';
import type { PageServerLoad } from './$types';
import type { Drop, Product, MediaCard } from '$lib/types';

export const load: PageServerLoad = async () => {
	// Parallel data fetching
	const [activeDrops, upcomingDrops, archivedDrops, products, mediaCards] = await Promise.all([
		// 1. Active Drop
		payloadClient.listDrops({
			query: {
				'where[status][equals]': 'ACTIVE',
				depth: 2, // Need products and banners
				limit: 1
			}
		}),
		// 2. Upcoming Drop
		payloadClient.listDrops({
			query: {
				'where[status][equals]': 'SCHEDULED',
				sort: 'release_date',
				limit: 1
			}
		}),
		// 3. Previous Drops
		payloadClient.listDrops({
			query: {
				'where[status][equals]': 'ARCHIVED',
				sort: '-end_date',
				limit: 6
			}
		}),
		// 4. Explore Products
		payloadClient.listProducts({
			query: {
				'where[status][equals]': 'AVAILABLE',
				limit: 12
			}
		}),
		// 5. Explore Media
		payloadClient.listMediaCards({
			query: {
				depth: 1,
				limit: 8
			}
		})
	]);

	return {
		activeDrop: activeDrops.docs[0] ?? null,
		upcomingDrop: upcomingDrops.docs[0] ?? null,
		archivedDrops: archivedDrops.docs,
		exploreProducts: products.docs,
		exploreMedia: mediaCards.docs
	};
};
