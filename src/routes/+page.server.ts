import { createServerPayloadClient } from '$lib/server/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const client = createServerPayloadClient(event);

	// Parallel data fetching
	const [activeDrops, upcomingDrops, archivedDrops, products, mediaCards] = await Promise.all([
		// 1. Active Drop
		client.getShopDrops({
			query: {
				'where[status][equals]': 'ACTIVE',
				limit: 1
			}
		}),
		// 2. Upcoming Drop
		client.getShopDrops({
			query: {
				'where[status][equals]': 'SCHEDULED',
				sort: 'release_date',
				limit: 1
			}
		}),
		// 3. Previous Drops
		client.getShopDrops({
			query: {
				'where[status][equals]': 'ARCHIVED',
				sort: '-end_date',
				limit: 6
			}
		}),
		// 4. Explore Products
		client.getShopProducts({
			query: {
				'where[status][equals]': 'AVAILABLE',
				limit: 12
			}
		}),
		// 5. Explore Media
		client.getShopMediaCards({
			query: {
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
