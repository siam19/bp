<script lang="ts">
	import MasonryGrid from '$lib/components/site/MasonryGrid.svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<div class="pt-24 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen">
	<div class="max-w-7xl mx-auto">
		<h1
			class="text-4xl md:text-6xl font-extrabold uppercase tracking-tighter text-white mb-8 text-center font-heading"
		>
			Catalog
		</h1>

		{#if data.products.length > 0}
			<MasonryGrid items={data.products} />
		{:else}
			<div class="text-center py-20">
				<p class="text-gray-400 text-xl">No products found.</p>
			</div>
		{/if}
	</div>
</div>
