<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { X, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import { ui } from '$lib/stores/ui.svelte';
	import ProductSizeBox from '$lib/components/site/ProductSizeBox.svelte';
	import MasonryGrid from '$lib/components/site/MasonryGrid.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';
	import type { ShopProduct, ShopImage, MasonryItem, ShopMediaCard } from '$lib/types';
	import { resolveShopImage, getMediaUrl } from '$lib/utils/media';
	import { payloadClient } from '$lib/api/payload';

	let { data } = $props<{ data: PageData }>();
	let product = $derived(data.product as ShopProduct);

	// Suggested Items State (Infinite Scroll)
	let suggestedItems = $state<MasonryItem[]>([]);
	let page = $state(1);
	let isLoadingMore = $state(false);
	let hasMore = $state(true);
	let loadTrigger = $state<HTMLElement | null>(null);

	// Initialize suggested items from data
	$effect(() => {
		const items: MasonryItem[] = [];

		// Add related products first (pinned)
		if (data.relatedProducts) {
			(data.relatedProducts as ShopProduct[]).forEach((p) => {
				items.push({
					id: p.id,
					type: 'product',
					product: p
				});
			});
		}

		// Add related media
		if (data.relatedMedia) {
			(data.relatedMedia as ShopMediaCard[]).forEach((m) => {
				items.push({
					id: m.id,
					type: 'media',
					media: {
						mediaURL: getMediaUrl(m.filename),
						title: '',
						taggedProducts: m.tagged_products.map((p) => p.id)
					}
				});
			});
		}

		suggestedItems = items;
		page = 1;
		hasMore = true;
	});

	async function loadMore() {
		if (isLoadingMore || !hasMore) return;
		isLoadingMore = true;

		try {
			// Fetch next page of products and media
			// Start from page 1 of global list since suggestedItems are separate
			const [productsRes, mediaRes] = await Promise.all([
				payloadClient.getShopProducts({ query: { page: page, limit: 4 } }),
				payloadClient.getShopMediaCards({ query: { page: page, limit: 4 } })
			]);

			const newItems: MasonryItem[] = [];

			if (productsRes.docs) {
				productsRes.docs.forEach((p) => {
					// Filter out current product and duplicates
					if (p.id !== product.id && !suggestedItems.find((i) => i.id === p.id)) {
						newItems.push({ id: p.id, type: 'product', product: p });
					}
				});
			}

			if (mediaRes.docs) {
				mediaRes.docs.forEach((m) => {
					if (!suggestedItems.find((i) => i.id === m.id)) {
						newItems.push({
							id: m.id,
							type: 'media',
							media: {
								mediaURL: getMediaUrl(m.filename),
								title: '',
								taggedProducts: m.tagged_products.map((p) => p.id)
							}
						});
					}
				});
			}

			if (newItems.length > 0) {
				// Shuffle new items to mix products and media
				for (let i = newItems.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[newItems[i], newItems[j]] = [newItems[j], newItems[i]];
				}
				suggestedItems = [...suggestedItems, ...newItems];
				page++;
			}

			// Check if we reached the end of both
			if (!productsRes.hasNextPage && !mediaRes.hasNextPage) {
				hasMore = false;
			}
		} catch (e) {
			console.error('Failed to load more items', e);
		} finally {
			isLoadingMore = false;
		}
	}

	// Intersection Observer for Infinite Scroll
	$effect(() => {
		if (loadTrigger && hasMore) {
			const observer = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					loadMore();
				}
			}, {
				rootMargin: '2000px' // Pre-load content well before reaching bottom
			});
			observer.observe(loadTrigger);
			return () => observer.disconnect();
		}
	});

	// State
	let selectedSize = $state<string | null>(null);
	let quantity = $state(1);
	
	// Gallery state - 3-slot rotation
	let galleryIndices = $state([0, 1, 2]);
	let rotationInterval: ReturnType<typeof setInterval> | null = null;

	// Modal state
	let imageModalOpen = $state(false);
	let modalImageIndex = $state(0);
	let sizeGuideOpen = $state(false);

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

	function resolveSizeGuideUrl(url: string | undefined): string {
		if (!url) return '';
		const filename = url.split('/').pop() || '';
		return getMediaUrl(filename);
	}

	// Gallery rotation logic (clockwise: Main -> TopRight -> BottomRight -> Main)
	function rotateGallery() {
		if (images.length < 3) return;
		galleryIndices = [
			galleryIndices[2],
			galleryIndices[0],
			galleryIndices[1]
		];
	}

	onMount(() => {
		if (images.length >= 3) {
			rotationInterval = setInterval(rotateGallery, 5000);
		}
	});

	onDestroy(() => {
		if (rotationInterval) {
			clearInterval(rotationInterval);
		}
	});

	// Image modal navigation
	function openImageModal(slotIndex: number) {
		modalImageIndex = galleryIndices[slotIndex] ?? 0;
		imageModalOpen = true;
	}

	function navImage(direction: number) {
		modalImageIndex = (modalImageIndex + direction + images.length) % images.length;
	}

	// Sizes
	let sizes = $derived.by(() => {
		if (!product.variants) return [];
		return product.variants
			.map((v) => ({
				id: v.id || v.sku || `temp-${v.size}`,
				sku: v.sku,
				size: v.size,
				available: v.stock_count > 0,
				stock: v.stock_count
			}))
			.filter((v) => v.size);
	});

	function addToCart() {
		if (!selectedSize) return;

		const variant = sizes.find((s) => s.size === selectedSize);
		if (!variant) return;

		cart.addItem({
			variantId: variant.id,
			productId: product.id,
			productName: product.name,
			variantName: variant.sku || `${product.name} - ${variant.size}`,
			price: product.price,
			image: getImageUrl(images[0]),
			quantity: quantity
		});

		ui.openCartSheet();
	}
	console.log(product)
</script>

<svelte:head>
	<title>{product.name} | BANGLAPUNK</title>
</svelte:head>

<div class="min-h-screen bg-[#050505] text-white">
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
			<!-- Product Gallery -->
			<section class="h-[500px] lg:h-[600px]">
				{#if images.length === 0}
					<div class="w-full h-full bg-[#1a1a1a] rounded-xl flex items-center justify-center text-gray-600">
						No Image Available
					</div>
				{:else if images.length === 1}
					<button
						type="button"
						class="w-full h-full bg-[#1a1a1a] rounded-xl overflow-hidden cursor-pointer group"
						onclick={() => openImageModal(0)}
					>
						<img
							src={getImageUrl(images[0])}
							class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
							alt={product.name}
						/>
					</button>
				{:else}
					<!-- Multi-image Grid -->
					<div class="grid grid-cols-2 gap-2 h-full">
						<!-- Slot 0: Main (Left) -->
						<button
							type="button"
							class="relative w-full h-full bg-[#1a1a1a] rounded-xl overflow-hidden cursor-pointer group"
							onclick={() => openImageModal(0)}
						>
							{#if images[galleryIndices[0]]}
								<img
									src={getImageUrl(images[galleryIndices[0]])}
									class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
									alt={product.name}
								/>
							{/if}
						</button>

						<!-- Right Column -->
						<div class="flex flex-col gap-2 h-full">
							<!-- Slot 1: Top Right -->
							{#if images.length >= 2}
								<button
									type="button"
									class="relative w-full {images.length >= 3 ? 'h-1/2' : 'h-full'} bg-[#1a1a1a] rounded-xl overflow-hidden cursor-pointer group"
									onclick={() => openImageModal(1)}
								>
									{#if images[galleryIndices[1]]}
										<img
											src={getImageUrl(images[galleryIndices[1]])}
											class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
											alt={product.name}
										/>
									{/if}
								</button>
							{/if}
							
							<!-- Slot 2: Bottom Right -->
							{#if images.length >= 3}
								<button
									type="button"
									class="relative w-full h-1/2 bg-[#1a1a1a] rounded-xl overflow-hidden cursor-pointer group"
									onclick={() => openImageModal(2)}
								>
									{#if images[galleryIndices[2]]}
										<img
											src={getImageUrl(images[galleryIndices[2]])}
											class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
											alt={product.name}
										/>
									{/if}
								</button>
							{/if}
						</div>
					</div>
				{/if}
			</section>

			<!-- Product Info -->
			<section class="flex flex-col justify-center">
				<h1 class="text-4xl md:text-5xl font-black uppercase leading-tight mb-2 font-heading tracking-tighter">{product.name}</h1>
				<div class="text-3xl font-bold text-gray-300 font-mono mb-8">
					{product.price} <span class="text-sm text-gray-500 align-top">BDT</span>
				</div>

				<!-- Size Selector -->
				<div class="mb-8">
					<div class="flex justify-between items-end mb-3">
						<span class="text-sm font-bold uppercase tracking-wider text-gray-400">
							Size: <span class="text-white">{selectedSize || '—'}</span>
						</span>
						<button
							onclick={() => (sizeGuideOpen = true)}
							class="text-xs text-gray-400 hover:text-white underline decoration-dotted transition-colors"
						>
							VIEW SIZE GUIDE
						</button>
					</div>

					<div class="flex gap-3 mb-2 flex-wrap">
						{#each sizes as s}
							<button
								onclick={() => s.available && (selectedSize = s.size)}
								disabled={!s.available}
								class="w-12 h-12 border rounded-md flex items-center justify-center font-bold text-sm transition-all duration-200
									{selectedSize === s.size
									? 'bg-white text-black border-white scale-105 shadow-lg shadow-white/10'
									: s.available
										? 'border-gray-700 hover:border-white text-white hover:bg-white/5'
										: 'border-gray-800 text-gray-600 cursor-not-allowed bg-gray-900/50'}"
							>
								{s.size}
							</button>
						{/each}
					</div>
					{#if !selectedSize}
						<p class="text-red-500 text-xs mt-2 h-4 font-mono">{selectedSize ? '' : '* Please select a size'}</p>
					{/if}
				</div>

				<!-- Actions -->
				<div class="flex gap-4 mb-10">
					<!-- Quantity Widget -->
					<div class="flex items-center border border-gray-700 rounded-lg h-14 px-2 bg-[#111]">
						<button
							onclick={() => (quantity = Math.max(1, quantity - 1))}
							class="w-10 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors text-xl"
							aria-label="Decrease quantity"
						>
							-
						</button>
						<span class="w-10 text-center font-mono font-bold text-lg">{quantity}</span>
						<button
							onclick={() => quantity++}
							class="w-10 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors text-xl"
							aria-label="Increase quantity"
						>
							+
						</button>
					</div>
					<!-- Add to Cart -->
					<Button
						size="lg"
						class="flex-1 h-14 bg-white text-black font-black text-lg rounded-lg hover:bg-gray-200 transition-colors uppercase tracking-widest"
						disabled={!selectedSize}
						onclick={addToCart}
					>
						{selectedSize ? 'Add to Cart' : 'Select Size'}
					</Button>
				</div>

				<!-- Description -->
				{#if product.description && product.description.length > 0}
					<div class="text-gray-300 text-sm leading-relaxed space-y-4 border-t border-gray-800 pt-6">
						<ul class="list-disc pl-5 space-y-2 text-gray-400 marker:text-gray-600">
							{#each product.description as block}
								{#if block.blockType === 'text_block' && block.content}
									<li>{block.content}</li>
								{/if}
							{/each}
						</ul>
					</div>
				{/if}
			</section>
		</div>

		<!-- Suggested Pairings -->
		{#if suggestedItems.length > 0 || hasMore}
			<section class="mt-24 border-t border-gray-900 pt-12">
				<div class="text-center mb-10">
					<p class="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">
						Picked Just For You
					</p>
					<h2 class="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Suggested Pairings</h2>
				</div>
				<MasonryGrid items={suggestedItems} />
				
				<!-- Infinite Scroll Trigger -->
				{#if hasMore}
					<div bind:this={loadTrigger} class="h-20 flex items-center justify-center mt-8">
						{#if isLoadingMore}
							<div class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						{/if}
					</div>
				{/if}
			</section>
		{/if}
	</main>
</div>

<!-- Image Viewer Modal -->
{#if imageModalOpen}
	<div 
		class="fixed inset-0 z-60 bg-black flex flex-col items-center justify-center"
		onclick={() => (imageModalOpen = false)}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Escape' && (imageModalOpen = false)}
	>
		<button
			onclick={() => (imageModalOpen = false)}
			class="absolute top-4 right-4 text-white p-2 hover:text-gray-300 z-10"
		>
			<X class="w-8 h-8" />
		</button>

		<div 
			class="relative w-full max-w-lg aspect-square"
			onclick={(e) => e.stopPropagation()}
			role="presentation"
		>
			<img
				src={getImageUrl(images[modalImageIndex])}
				class="w-full h-full object-contain"
				alt={product.name}
			/>

			<!-- Navigation Arrows -->
			{#if images.length > 1}
				<button
					onclick={(e) => { e.stopPropagation(); navImage(-1); }}
					class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
				>
					<ChevronLeft class="w-6 h-6 text-white" />
				</button>
				<button
					onclick={(e) => { e.stopPropagation(); navImage(1); }}
					class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
				>
					<ChevronRight class="w-6 h-6 text-white" />
				</button>
			{/if}
		</div>

		<!-- Image Indicators -->
		<div class="flex gap-2 mt-4" onclick={(e) => e.stopPropagation()} role="presentation">
			{#each images as _, i}
				<button
					onclick={() => (modalImageIndex = i)}
					aria-label="View image {i + 1}"
					class="w-2 h-2 rounded-full transition-colors {modalImageIndex === i
						? 'bg-white'
						: 'bg-gray-600'}"
				></button>
			{/each}
		</div>
	</div>
{/if}

<!-- Size Guide Modal -->
{#if sizeGuideOpen}
	<div class="fixed inset-0 z-60 flex items-center justify-center p-4">
		<button
			class="absolute inset-0 bg-black/80 backdrop-blur-sm"
			onclick={() => (sizeGuideOpen = false)}
			aria-label="Close size guide"
		></button>
		<div class="relative bg-white w-full max-w-lg rounded-xl p-4 overflow-hidden shadow-2xl">
			<div class="flex justify-between items-center mb-4">
				<h3 class="text-lg font-bold text-black">Size Guide</h3>
				<button onclick={() => (sizeGuideOpen = false)} class="text-gray-500 hover:text-black">
					<X class="w-5 h-5" />
				</button>
			</div>
			<div class="text-sm text-gray-600 flex justify-center">
				{#if product.size_guide}
					<img src={resolveSizeGuideUrl(product.size_guide)} alt="Size Guide" class="w-full h-auto object-contain" />
				{:else}
					<p class="py-8 text-center text-gray-500">Size guide not available for this product.</p>
				{/if}
			</div>
		</div>
	</div>
{/if}
