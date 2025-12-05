<script lang="ts">
	import type { Product, MediaAsset, Variant } from '$lib/types';
	import ProductSizeBox from './ProductSizeBox.svelte';

	let { product } = $props<{ product: Product }>();

	function getImageUrl(image: string | MediaAsset | undefined): string {
		if (!image) return '';
		if (typeof image === 'string') return image;
		return image.url || '';
	}

	let sizes = $derived.by(() => {
		if (!product.variants?.docs) return [];
		return product.variants.docs
			.map((v: string | Variant) => {
				if (typeof v === 'string') return null; // Skip ID-only variants for now
				return { size: v.size, available: v.stock_count > 0 };
			})
			.filter((v: { size: string; available: boolean } | null) => v !== null)
			.slice(0, 5);
	});
</script>

<a
	href="/p/{product.slug}"
	class="group block bg-white text-black rounded-md p-4 transition-transform hover:-translate-y-1 hover:shadow-lg"
>
	<!-- Image -->
	<div class="aspect-square bg-[#e5e5e5] rounded-lg mb-4 relative overflow-hidden">
		{#if product.images?.front}
			<img
				src={getImageUrl(product.images.front)}
				alt={product.name}
				class="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
			/>
		{:else}
			<div class="w-full h-full flex items-center justify-center text-gray-400">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
					<circle cx="9" cy="9" r="2" />
					<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
				</svg>
			</div>
		{/if}

		{#if product.status === 'UPCOMING'}
			<div class="absolute top-2 right-2 bg-black text-white text-xs font-bold px-2 py-1 rounded">
				SOON
			</div>
		{/if}
	</div>

	<!-- Info -->
	<div class="flex justify-between items-start mb-2">
		<div class="overflow-hidden w-2/3">
			<h4
				class="font-bold text-lg truncate uppercase group-hover:text-red-600 transition-colors font-heading"
			>
				{product.name}
			</h4>
		</div>
		<span class="font-bold text-lg">৳{product.price}</span>
	</div>

	<!-- Sizes -->
	{#if sizes.length > 0}
		<div class="flex gap-2 mb-4 flex-wrap">
			{#each sizes as s}
				<ProductSizeBox size={s.size} available={s.available} />
			{/each}
		</div>
	{/if}

	<button
		class="w-full py-3 bg-black text-white font-bold uppercase text-xs rounded hover:opacity-80 transition"
	>
		View Details
	</button>
</a>
