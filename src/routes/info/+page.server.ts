import { createServerPayloadClient, handleApiError } from '$lib/server/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const client = createServerPayloadClient(event);

	try {
		const infoPage = await client.getShopInfoPage();

		return {
			tabs: infoPage.tabs
		};
	} catch (err) {
		handleApiError(err);
	}
};
