<script lang="ts">
	import type { Drop } from '$lib/types';
	import DropArchiveCard from './DropArchiveCard.svelte';

	let { drops } = $props<{ drops: Drop[] }>();

	function transformDrop(drop: Drop) {
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

<div class="space-y-6">
	<div class="flex items-center justify-between px-4">
		<h2 class="text-xl font-bold text-white">Previous Drops</h2>
		<a href="/d" class="text-sm font-bold text-gray-400 hover:text-white">View All</a>
	</div>

	<div
		class="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide sm:gap-6"
	>
		{#each drops as drop}
			<div class="w-[80vw] flex-none snap-center sm:w-[400px]">
				<DropArchiveCard drop={transformDrop(drop)} />
			</div>
		{/each}
	</div>
</div>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
