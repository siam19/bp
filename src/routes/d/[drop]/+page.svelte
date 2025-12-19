<script lang="ts">
	import Navbar from '$lib/components/site/Navbar.svelte';
	import DropCarousel from '$lib/components/site/DropCarousel.svelte';
	import Countdown from '$lib/components/site/Countdown.svelte';
	import DropVideo from '$lib/components/site/DropVideo.svelte';
	import DropHeader from './DropHeader.svelte';
	import MasonryGrid from '$lib/components/site/MasonryGrid.svelte';
	import type { ShopProduct, ShopMediaCard } from '$lib/types';
	import type { MasonryItem } from '$lib/types';
	import { getMediaUrl } from '$lib/utils/media';

	let { data } = $props();

	// Countdown Logic
	let countdownConfig = $derived.by(() => {
		if (data.drop.status === 'SCHEDULED' && data.drop.release_date) {
			return {
				target: new Date(data.drop.release_date),
				label: 'Drops in',
				isLive: false
			};
		}

		if (data.drop.status === 'ACTIVE' && data.drop.end_date) {
			return {
				target: new Date(data.drop.end_date),
				label: 'Ends in',
				isLive: true
			};
		}

		return null;
	});

	// Masonry Items Transform
	function buildMasonryItems(
		products: ShopProduct[] | undefined,
		mediaCards: ShopMediaCard[]
	): MasonryItem[] {
		const productItems: MasonryItem[] = (products ?? [])
			.map((p: any) => ({
				id: `p-${p.id}`,
				type: 'product' as const,
				product: {
					...p,
					images: p.images || (p.image ? { front: p.image } : undefined)
				}
			}));

		const mediaItems: MasonryItem[] = mediaCards.map((m) => ({
			id: `m-${m.id}`,
			type: 'media' as const,
			media: {
				id: m.id,
				mediaURL: getMediaUrl(m.filename),
				title: '',
				taggedProducts: m.tagged_products.map((p) => p.id)
			}
		}));

		// Interleave: product, media, product, product, media pattern
		const result: MasonryItem[] = [];
		let pIdx = 0,
			mIdx = 0;

		while (pIdx < productItems.length || mIdx < mediaItems.length) {
			// Add 2 products
			if (pIdx < productItems.length) result.push(productItems[pIdx++]);
			if (pIdx < productItems.length) result.push(productItems[pIdx++]);
			// Add 1 media
			if (mIdx < mediaItems.length) result.push(mediaItems[mIdx++]);
		}

		return result;
	}

	let masonryItems = $derived(buildMasonryItems(data.drop.products, data.relatedMedia));
</script>

<div class="min-h-screen bg-black pb-20">

	<!-- Hero: Carousel -->
	{#if data.drop.assets?.banners?.length}
		<DropCarousel banners={data.drop.assets.banners} />
	{/if}

	<!-- Countdown -->
	{#if countdownConfig}
		<div class="py-6">
			<Countdown targetDate={countdownConfig.target} label={countdownConfig.label} />
		</div>
	{/if}

	<!-- Drop Info -->
	<DropHeader name={data.drop.name} description={data.drop.description} />

	<!-- Video -->
	{#if data.drop.assets?.video_embed_url}
		<div class="px-4 py-6">
			<DropVideo url={data.drop.assets.video_embed_url} />
		</div>
	{/if}

	<!-- Product Grid -->
	<div class="px-4 py-8">
		<h2 class="mb-6 text-xl font-bold text-center text-white">Drop Collection</h2>

		<MasonryGrid items={masonryItems} />
	</div>
</div>
