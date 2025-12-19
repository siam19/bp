<script lang="ts">
	import DropArchiveCard from '$lib/components/site/DropArchiveCard.svelte';
	import Navbar from '$lib/components/site/Navbar.svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<div class="flex min-h-screen flex-col bg-[#050505] text-white">
	<Navbar />

	<main class="mx-auto w-full max-w-md flex-1 px-4 pb-10 pt-20">
		<h1 class="mb-2 font-sans text-4xl font-black tracking-tight uppercase text-white">Archive</h1>
		<p class="mb-8 font-mono text-xs text-gray-500">All drops.</p>

		<div class="space-y-6">
			{#each data.drops.docs as drop (drop.id)}
				<DropArchiveCard
					drop={{
						id: drop.id,
						slug: drop.slug,
						name: drop.name,
						status: drop.status,
						release_date: drop.release_date,
						end_date: drop.end_date,
						banner: drop.assets?.banners?.[0] || null
					}}
				/>
			{/each}
		</div>
	</main>
</div>
