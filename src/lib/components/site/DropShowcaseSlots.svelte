<script lang="ts">
	import type { Product } from '$lib/types';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	let { products } = $props<{ products: Product[] }>();

	// We need at least a few products to make this interesting
	// If fewer than 3, we just show what we have statically
	let validProducts = $derived(
		products.filter((p) => p.images?.front?.url || p.images?.front?.sizes?.card?.url)
	);

	let slot1Index = $state(0);
	let slot2Index = $state(0);
	let slot3Index = $state(0);

	function getImage(product: Product) {
		return product.images?.front?.url ?? product.images?.front?.sizes?.card?.url ?? '';
	}

	onMount(() => {
		if (validProducts.length < 2) return;

		const i1 = setInterval(() => {
			slot1Index = (slot1Index + 1) % validProducts.length;
		}, 3000);

		const i2 = setInterval(() => {
			slot2Index = (slot2Index + 1) % validProducts.length;
		}, 4500);

		const i3 = setInterval(() => {
			slot3Index = (slot3Index + 1) % validProducts.length;
		}, 6000);

		return () => {
			clearInterval(i1);
			clearInterval(i2);
			clearInterval(i3);
		};
	});
</script>

{#if validProducts.length > 0}
	<div class="grid grid-cols-3 gap-2 sm:gap-4">
		<!-- Slot 1 -->
		<div class="relative aspect-3/4 overflow-hidden rounded-lg bg-neutral-900">
			{#key slot1Index}
				<div class="absolute inset-0" transition:fade={{ duration: 800 }}>
					<img
						src={getImage(validProducts[slot1Index])}
						alt={validProducts[slot1Index].name}
						class="h-full w-full object-cover"
					/>
				</div>
			{/key}
		</div>

		<!-- Slot 2 -->
		<div class="relative aspect-3/4 overflow-hidden rounded-lg bg-neutral-900">
			{#if validProducts.length > 1}
				{#key slot2Index}
					<div class="absolute inset-0" transition:fade={{ duration: 800 }}>
						<img
							src={getImage(validProducts[(slot2Index + 1) % validProducts.length])}
							alt={validProducts[(slot2Index + 1) % validProducts.length].name}
							class="h-full w-full object-cover"
						/>
					</div>
				{/key}
			{:else}
				<div class="absolute inset-0 flex items-center justify-center text-gray-700">
					<span>BP</span>
				</div>
			{/if}
		</div>

		<!-- Slot 3 -->
		<div class="relative aspect-3/4 overflow-hidden rounded-lg bg-neutral-900">
			{#if validProducts.length > 2}
				{#key slot3Index}
					<div class="absolute inset-0" transition:fade={{ duration: 800 }}>
						<img
							src={getImage(validProducts[(slot3Index + 2) % validProducts.length])}
							alt={validProducts[(slot3Index + 2) % validProducts.length].name}
							class="h-full w-full object-cover"
						/>
					</div>
				{/key}
			{:else}
				<div class="absolute inset-0 flex items-center justify-center text-gray-700">
					<span>BP</span>
				</div>
			{/if}
		</div>
	</div>
{/if}
