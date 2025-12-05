<script lang="ts">
	import DropArchiveCard from '$lib/components/site/DropArchiveCard.svelte';

	let { data } = $props();
	
	// Group drops by status
	let liveDrops = $derived(data.drops.filter((d) => d.status === 'ACTIVE'));
	let upcomingDrops = $derived(data.drops.filter((d) => d.status === 'SCHEDULED'));
	let archivedDrops = $derived(data.drops.filter((d) => d.status === 'ARCHIVED'));

	// Combined list for display (Live -> Upcoming -> Archived)
	let sortedDrops = $derived([...liveDrops, ...upcomingDrops, ...archivedDrops]);
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
					<DropArchiveCard {drop} />
				{/each}
			</div>
		{/if}
	</div>
</div>
