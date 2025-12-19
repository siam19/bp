import { payloadClient } from '$lib/api/payload';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { drop } = params;

	try {
		const [dropData, mediaCards] = await Promise.all([
			payloadClient.getShopDrop(drop, { fetch }),
			payloadClient.getShopMediaCards({ fetch, query: { limit: 100 } })
		]);

		// Filter media cards that are relevant to this drop's products
		// A media card is relevant if it tags any product in the drop
		const dropProductIds = new Set(dropData.products.map((p) => p.id));
		const relatedMedia = mediaCards.docs.filter((card) =>
			card.tagged_products.some((tp) => dropProductIds.has(tp.id))
		);

		return {
			drop: dropData,
			relatedMedia
		};
	} catch (e) {
		console.error(e);
		throw error(404, 'Drop not found');
	}
};
