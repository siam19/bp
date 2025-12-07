<script lang="ts">
	import DropArchiveCard from '$lib/components/site/DropArchiveCard.svelte';
	import type { PageData } from './$types';
	import type { ShopDrop } from '$lib/types';

	let { data }: { data: PageData } = $props();
	
	// Group drops by status
	let liveDrops = $derived(data.drops.filter((d: ShopDrop) => d.status === 'ACTIVE'));
	let upcomingDrops = $derived(data.drops.filter((d: ShopDrop) => d.status === 'SCHEDULED'));
	let archivedDrops = $derived(data.drops.filter((d: ShopDrop) => d.status === 'ARCHIVED'));

	// Combined list for display (Live -> Upcoming -> Archived)
	let sortedDrops = $derived([...liveDrops, ...upcomingDrops, ...archivedDrops]);

	function transformDrop(drop: ShopDrop) {
		return {
			id: drop.id,
			slug: drop.slug,
			name: drop.name,
			status: drop.status,
			release_date: drop.release_date,
			end_date: drop.end_date,
			banner: drop.assets?.banners?.[0] ?? null
		};
	}
</script>

<div class="min-h-screen bg-black pb-20">
	<div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8 text-center">
			<h1 class="text-3xl font-black uppercase tracking-tighter text-white sm:text-4xl">
				Drop Archive
			</h1>
			<p class="mt-2 text-gray-400">Past, present, and future collections.</p>
		</div>

		{#if sortedDrops.length === 0}
			<div class="py-20 text-center">
				<p class="text-gray-500">No drops found.</p>
			</div>
		{:else}
			<div class="space-y-8">
				{#each sortedDrops as drop (drop.id)}
					<DropArchiveCard drop={transformDrop(drop)} />
				{/each}
			</div>
		{/if}
	</div>
</div>
