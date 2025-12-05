<script lang="ts">
	import HamburgerMenu from './HamburgerMenu.svelte';
	import CartSheet from './CartSheet.svelte';
	import headerLogo from '$lib/assets/header-logo.svg';
	import addToCartIcon from '$lib/assets/add-to-cart.svg';
	import { cart } from '$lib/stores/cart.svelte';
	
	let isCartOpen = $state(false);

	function openCart() {
		isCartOpen = true;
	}
</script>

<header class="sticky top-0 z-30 bg-black/60 backdrop-blur-sm shadow-sm">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16 lg:h-20">
			<!-- Mobile Layout: Hamburger (left), Logo (center), Cart (right) -->
			<div class="flex items-center md:hidden">
				<HamburgerMenu />
			</div>
			
			<!-- Logo - Center on mobile, Left on desktop -->
			<div class="flex-shrink-0 md:flex-shrink-0">
				<a href="/" class="flex items-center">
					<img src={headerLogo} alt="BanglaPunk" class="h-12 sm:h-10 lg:h-12 w-auto" />
				</a>
			</div>

		<!-- Desktop Navigation -->
		<nav class="hidden md:flex md:space-x-6 lg:space-x-8">
			<a
				href="/drops"
				class="text-white hover:text-gray-500 px-3 py-2 text-sm lg:text-base font-black uppercase transition-colors cursor-pointer relative group"
			>
				Drops
				<!-- <span class="absolute inset-x-0 bottom-0 h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span> -->
			</a>
			<a
				href="/archive"
				class="text-white hover:text-gray-500 px-3 py-2 text-sm lg:text-base font-black uppercase transition-colors cursor-pointer relative group"
			>
				Archive
				<!-- <span class="absolute inset-x-0 bottom-0 h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span> -->
			</a>
			<a
				href="/media"
				class="text-white hover:text-gray-500 px-3 py-2 text-sm lg:text-base font-black uppercase transition-colors cursor-pointer relative group"
			>
				Media
				<!-- <span class="absolute inset-x-0 bottom-0 h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span> -->
			</a>
			<a
				href="/what"
				class="text-white hover:text-gray-500 px-3 py-2 text-sm lg:text-base font-black uppercase transition-colors cursor-pointer relative group"
			>
				What?
				<!-- <span class="absolute inset-x-0 bottom-0 h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span> -->
			</a>
		</nav>			<!-- Cart Button - Right side -->
			<div class="flex items-center">
				<button
					onclick={openCart}
					class="relative p-2 text-white hover:text-gray-900 transition-colors cursor-pointer"
					aria-label="Open cart"
				>
					<img src={addToCartIcon} alt="Add to cart" class="h-6 w-6" />
					{#if cart.count > 0}
						<span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
							{cart.count}
						</span>
					{/if}
				</button>
			</div>
		</div>
	</div>
</header>

<!-- Cart Sheet -->
<CartSheet bind:open={isCartOpen} />