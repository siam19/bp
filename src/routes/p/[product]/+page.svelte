<script lang="ts">
	import { cart } from '$lib/stores/cart.svelte';
	import { ui } from '$lib/stores/ui.svelte';
	import ProductSizeBox from '$lib/components/site/ProductSizeBox.svelte';
	import MasonryGrid from '$lib/components/site/MasonryGrid.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';
	import type { ShopProduct, ShopImage, MasonryItem, MediaCard as MediaCardType, ShopMediaCard } from '$lib/types';
	import { resolveShopImage, getMediaUrl } from '$lib/utils/media';

	let { data } = $props<{ data: PageData }>();
	let product = $derived(data.product as ShopProduct);

	// Transform related media to MasonryItems
	let relatedMediaItems = $derived(
		(data.relatedMedia as ShopMediaCard[]).map((m): MasonryItem => ({
			id: m.id,
			type: 'media',
			media: {
				mediaURL: getMediaUrl(m.filename),
				title: '',
				taggedProducts: m.tagged_products.map((p) => p.id)
			}
		}))
	);

	// State
	let selectedSize = $state<string | null>(null);
	let quantity = $state(1);
	let activeImageIndex = $state(0);

	// Images
	let images = $derived.by(() => {
		const imgs: ShopImage[] = [];
		if (product.images.front) imgs.push(product.images.front);
		if (product.images.back) imgs.push(product.images.back);
		if (product.images.profile) imgs.push(product.images.profile);
		return imgs;
	});

	function getImageUrl(image: ShopImage): string {
		return resolveShopImage(image);
	}

	// Sizes
	let sizes = $derived.by(() => {
		if (!product.variants) return [];
		return product.variants
			.map((v) => {
				return {
					id: v.id || '',
					size: v.size,
					available: v.stock_count > 0,
					stock: v.stock_count
				};
			})
			.filter((v) => v.id !== '');
	});
	
	

	function addToCart() {
		if (!selectedSize) return;

		const variant = sizes.find((s) => s.size === selectedSize);
		if (!variant) return;

		cart.addItem({
			variantId: variant.id,
			productId: product.id,
			productName: product.name,
			variantName: `${product.name} - ${variant.size}`,
			price: product.price,
			image: getImageUrl(images[0]),
			quantity: quantity
		});

		ui.openCartSheet();


	}

	console.log('Product Page Product:', product);
</script>

<div class="pt-24 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen">
	<div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
		<!-- Gallery -->
		<div class="space-y-4">
			<div class="aspect-square bg-[#e5e5e5] rounded-xl overflow-hidden">
				{#if images.length > 0}
					<img
						src={getImageUrl(images[activeImageIndex])}
						alt={product.name}
						class="w-full h-full object-cover mix-blend-multiply"
					/>
				{/if}
			</div>
			<div class="grid grid-cols-4 gap-4">
				{#each images as img, i}
					<button
						class="aspect-square bg-[#e5e5e5] rounded-lg overflow-hidden border-2 transition-colors {activeImageIndex ===
						i
							? 'border-black'
							: 'border-transparent'}"
						onclick={() => (activeImageIndex = i)}
					>
						<img
							src={getImageUrl(img)}
							alt=""
							class="w-full h-full object-cover mix-blend-multiply"
						/>
					</button>
				{/each}
			</div>
		</div>

		<!-- Info -->
		<div class="space-y-8">
			<div>
				<h1
					class="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter text-white mb-2 font-heading"
				>
					{product.name}
				</h1>
				<p class="text-2xl font-bold text-white">৳{product.price}</p>
			</div>

			<!-- Sizes -->
			<div>
				<span class="block text-sm font-bold text-gray-400 uppercase mb-2">Select Size</span>
				<div class="flex flex-wrap gap-3">
					{#each sizes as s}
						{#if s}
							<button
								onclick={() => s.available && (selectedSize = s.size)}
								disabled={!s.available}
								class="focus:outline-none"
							>
								<ProductSizeBox
									size={s.size}
									available={s.available}
									selected={selectedSize === s.size}
									class="w-12 h-12 text-base"
								/>
							</button>
						{/if}
					{/each}
				</div>
				{#if !selectedSize}
					<p class="text-red-500 text-sm mt-2 animate-pulse">Please select a size</p>
				{/if}
			</div>

			<!-- Quantity -->
			<div>
				<span class="block text-sm font-bold text-gray-400 uppercase mb-2">Quantity</span>
				<div
					class="flex items-center gap-4 bg-neutral-900 w-fit rounded-lg p-1 border border-white/10"
				>
					<button
						class="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded"
						onclick={() => (quantity = Math.max(1, quantity - 1))}
					>
						-
					</button>
					<span class="w-8 text-center font-bold text-white">{quantity}</span>
					<button
						class="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded"
						onclick={() => quantity++}
					>
						+
					</button>
				</div>
			</div>

			<!-- Actions -->
			<div class="pt-4">
				<Button
					size="lg"
					class="w-full text-lg py-6 uppercase tracking-widest"
					disabled={!selectedSize}
					onclick={addToCart}
				>
					{selectedSize ? 'Add to Cart' : 'Select Size'}
				</Button>
			</div>

			<!-- Description -->
			<div class="prose prose-invert max-w-none pt-8 border-t border-white/10">
				{#if product.description}
					{#each product.description as block}
						{#if block.blockType === 'text_block'}
							<p>{block.content}</p>
						{:else if block.blockType === 'image_block' && block.image}
							<img src={getImageUrl(block.image)} alt="" class="rounded-lg my-4" />
						{/if}
					{/each}
				{/if}
			</div>
		</div>
	</div>

	<!-- Related Media -->
	{#if relatedMediaItems.length > 0}
		<div class="mt-24">
			<h2 class="text-3xl font-bold uppercase text-white mb-8 font-heading">Styled With</h2>
			<MasonryGrid items={relatedMediaItems} />
		</div>
	{/if}
</div>
