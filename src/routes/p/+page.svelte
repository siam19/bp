<script lang="ts">
	import { onMount } from 'svelte';
	import { Search } from 'lucide-svelte';
	import { payloadClient, type PaginatedResponse } from '$lib/api/payload';
	import type { ShopProduct, ShopDrop, MasonryItem } from '$lib/types';
	import MasonryGrid from '$lib/components/site/MasonryGrid.svelte';
	import Navbar from '$lib/components/site/Navbar.svelte';

	let { data } = $props<{ data: { productsData: PaginatedResponse<ShopProduct> } }>();

	// Initialize state from server data
	let allProducts = $state<ShopProduct[]>([]);
	let products = $state<ShopProduct[]>([]);
	let drops = $state<ShopDrop[]>([]);
	let dropsLoading = $state(true);
	let searchTerm = $state('');
	let activeFilter = $state<string | null>(null);
	let currentPage = $state(1);
	let hasNextPage = $state(false);
	let isLoadingMore = $state(false);
	let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

	// Sync state with server data
	$effect(() => {
		allProducts = data.productsData.docs;
		products = data.productsData.docs;
		currentPage = data.productsData.page;
		hasNextPage = data.productsData.hasNextPage;
	});

	// Derived: Convert products to MasonryItems with search filtering
	let masonryItems = $derived.by(() => {
		let filtered = products;
		
		// Client-side search filtering
		if (searchTerm.trim()) {
			const term = searchTerm.toLowerCase().trim();
			filtered = filtered.filter((p) => 
				p.name.toLowerCase().includes(term) ||
				(p.tags && p.tags.some(t => t.toLowerCase().includes(term)))
			);
		}
		
		return filtered.map((product) => ({
			id: product.id,
			type: 'product' as const,
			product
		}));
	});

	// Fetch drops for filter chips (client-side after main content loads)
	onMount(() => {
		const fetchDrops = async () => {
			try {
				const dropsData = await payloadClient.getShopDrops();
				drops = dropsData.docs;
			} catch (error) {
				console.error('Failed to fetch drops:', error);
			} finally {
				dropsLoading = false;
			}
		};
		fetchDrops();

		// Set up intersection observer for infinite scroll
		const sentinel = document.getElementById('scroll-sentinel');
		let observer: IntersectionObserver | null = null;
		if (sentinel) {
			observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting && hasNextPage && !isLoadingMore && !activeFilter) {
						loadMoreProducts();
					}
				},
				{ rootMargin: '100px' }
			);
			observer.observe(sentinel);
		}

		return () => {
			if (observer) observer.disconnect();
		};
	});

	// Load more products (infinite scroll) - only for "ALL" view
	async function loadMoreProducts() {
		if (isLoadingMore || !hasNextPage || activeFilter) return;
		isLoadingMore = true;

		try {
			const nextPage = currentPage + 1;
			const query: Record<string, any> = { limit: 12, page: nextPage };

			const moreProducts = await payloadClient.getShopProducts({ query });
			allProducts = [...allProducts, ...moreProducts.docs];
			products = allProducts;
			currentPage = moreProducts.page;
			hasNextPage = moreProducts.hasNextPage;
		} catch (error) {
			console.error('Failed to load more products:', error);
		} finally {
			isLoadingMore = false;
		}
	}

	// Search handler with debounce (client-side filtering via derived)
	function handleSearch(event: Event) {
		const target = event.target as HTMLInputElement;
		searchTerm = target.value;
	}

	// Filter by drop
	async function handleFilterClick(dropId: string | null) {
		activeFilter = dropId;
		
		if (dropId === null) {
			// Show all products
			products = allProducts;
			hasNextPage = data.productsData.hasNextPage;
		} else {
			// Get products from the selected drop
			const selectedDrop = drops.find(d => d.id === dropId);
			if (selectedDrop && selectedDrop.products) {
				products = selectedDrop.products;
				hasNextPage = false; // Drop products are already complete
			}
		}
	}
</script>

<svelte:head>
	<title>All Products | BANGLAPUNK</title>
</svelte:head>

<div class="min-h-screen bg-[#050505]">

	<main class="max-w-md mx-auto px-4 pt-5
     pb-10">
		<!-- Sticky Search / Filter Header -->
		<div
			class="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-sm pb-4 pt-2 -mx-4 px-4 border-b border-gray-900 mb-6"
		>
			<!-- Search Input -->
			<div class="relative">
				<Search class="absolute left-3 top-3 w-4 h-4 text-gray-500" />
				<input
					type="text"
					placeholder="Search products..."
					value={searchTerm}
					oninput={handleSearch}
					class="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:border-white focus:outline-none transition-colors placeholder-gray-600"
				/>
			</div>

			<!-- Filter Chips -->
			<div class="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
				<button
					onclick={() => handleFilterClick(null)}
					class="px-3 py-1 text-[10px] font-bold rounded-full whitespace-nowrap transition-colors {activeFilter ===
					null
						? 'bg-white text-black'
						: 'bg-gray-800 text-gray-300 hover:bg-gray-700'}"
				>
					ALL
				</button>

				{#if dropsLoading}
					<div class="h-6 w-16 bg-gray-800 rounded-full animate-pulse"></div>
				{:else}
					{#each drops as drop (drop.id)}
						<button
							onclick={() => handleFilterClick(drop.id)}
							class="px-3 py-1 text-[10px] font-bold rounded-full whitespace-nowrap transition-colors {activeFilter ===
							drop.id
								? 'bg-white text-black'
								: 'bg-gray-800 text-gray-300 hover:bg-gray-700'}"
						>
							{drop.name.toUpperCase()}
						</button>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Product Grid -->
		{#if masonryItems.length > 0}
			<MasonryGrid items={masonryItems} />
		{:else}
			<div class="text-center py-12 text-gray-500">
				<p>No products found.</p>
			</div>
		{/if}

		<!-- Scroll Sentinel for Infinite Scroll -->
		<div id="scroll-sentinel" class="h-4"></div>

		{#if isLoadingMore}
			<div class="flex justify-center py-4">
				<div class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
			</div>
		{/if}

		{#if !hasNextPage && products.length > 0}
			<div class="text-center py-4 text-xs text-gray-600 font-mono">END OF CATALOG</div>
		{/if}
	</main>
</div>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
