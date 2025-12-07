import { createServerPayloadClient } from '$lib/server/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const client = createServerPayloadClient(event);

	const infoPage = await client.getInfoPage();

	return {
		infoPage
	};
};
