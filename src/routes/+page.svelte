<script lang="ts">
	import Navbar from '$lib/components/site/Navbar.svelte';
	import DropCarousel from '$lib/components/site/DropCarousel.svelte';
	import Countdown from '$lib/components/site/Countdown.svelte';
	import DropShowcaseSlots from '$lib/components/site/DropShowcaseSlots.svelte';
	import UpcomingDropBanner from '$lib/components/site/UpcomingDropBanner.svelte';
	import PreviousDrops from '$lib/components/site/PreviousDrops.svelte';
	import MasonryGrid from '$lib/components/site/MasonryGrid.svelte';
	import type { Product, MediaCard as MediaCardType } from '$lib/types';
	import type { MasonryItem } from '$lib/types';

	let { data } = $props();
	let activeDrop = $derived(data.activeDrop);
	let upcomingDrop = $derived(data.upcomingDrop);
	let archivedDrops = $derived(data.archivedDrops);
	let exploreProducts = $derived(data.exploreProducts);
	let exploreMedia = $derived(data.exploreMedia);

	// Countdown Logic for Active Drop
	let activeCountdownConfig = $derived.by(() => {
		if (activeDrop && activeDrop.end_date) {
			return {
				target: new Date(activeDrop.end_date),
				label: 'Ends in'
			};
		}
		return null;
	});

	// Masonry Items Transform
	function buildMasonryItems(
		products: Product[],
		mediaCards: MediaCardType[]
	): MasonryItem[] {
		const productItems: MasonryItem[] = products.map((p) => ({
			id: `p-${p.id}`,
			type: 'product' as const,
			product: p
		}));

		const mediaItems: MasonryItem[] = mediaCards.map((m) => ({
			id: `m-${m.id}`,
			type: 'media' as const,
			media: m
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

	let masonryItems = $derived(buildMasonryItems(exploreProducts, exploreMedia));
</script>

<div class="min-h-screen bg-black pb-20">
	<!-- Hero Section -->
	{#if activeDrop}
		<section class="relative">
			{#if activeDrop.assets?.banners?.length}
				<DropCarousel banners={activeDrop.assets.banners} />
			{/if}

			<div class="mt-6 space-y-8 px-4">
				<!-- Title & Countdown -->
				<div class="text-center">
					<h1 class="mb-4 text-4xl font-black uppercase tracking-tighter text-white sm:text-6xl">
						{activeDrop.name}
					</h1>
					{#if activeCountdownConfig}
						<Countdown
							targetDate={activeCountdownConfig.target}
							label={activeCountdownConfig.label}
						/>
					{/if}
				</div>

				<!-- Showcase Slots -->
				{#if activeDrop.products}
					<div class="mx-auto max-w-4xl">
						<DropShowcaseSlots products={activeDrop.products as Product[]} />
					</div>
				{/if}

				<!-- CTA -->
				<div class="flex justify-center">
					<a
						href="/d/{activeDrop.slug}"
						class="rounded-full bg-white px-8 py-4 text-lg font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 hover:bg-gray-200"
					>
						Shop Collection
					</a>
				</div>
			</div>
		</section>
	{:else}
		<!-- Fallback Hero (No Active Drop) -->
		<section class="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
			<h1 class="mb-4 text-5xl font-black uppercase tracking-tighter text-white sm:text-7xl">
				BANGLAPUNK
			</h1>
			<p class="max-w-md text-gray-400">
				Limited edition streetwear drops.
			</p>
		</section>
	{/if}

	<!-- Upcoming Drop -->
	{#if upcomingDrop}
		<section class="mx-auto max-w-2xl px-4 py-16">
			<UpcomingDropBanner drop={upcomingDrop} />
		</section>
	{/if}

	<!-- Previous Drops -->
	{#if archivedDrops.length > 0}
		<section class="py-12">
			<PreviousDrops drops={archivedDrops} />
		</section>
	{/if}

	<!-- Explore Section -->
	<section class="px-4 py-12">
		<h2 class="mb-8 text-center text-2xl font-black uppercase tracking-tight text-white">
			Explore
		</h2>
		<MasonryGrid items={masonryItems} />
	</section>
</div>
