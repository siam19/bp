<script lang="ts">
	import { ui } from '$lib/stores/ui.svelte';
	import { cart } from '$lib/stores/cart.svelte';
	import HamburgerMenu from './HamburgerMenu.svelte';
	import logo from '$lib/assets/navbar-logo.svg';

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/p', label: 'Products' },
		{ href: '/d', label: 'Drops' },
		{ href: '/info', label: 'Info' },
		{ href: '/contact', label: 'Contact' }
	];

	let currentPath = $state('/');

	// Update current path (you can use $page.url.pathname in actual implementation)
	if (typeof window !== 'undefined') {
		currentPath = window.location.pathname;
	}
</script>

<nav
	class="sticky top-0 z-30 bg-black/60 backdrop-blur-sm shadow-sm border-b border-white/5"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
			<!-- Left: Hamburger (Mobile) -->
			<div class="md:hidden">
				<HamburgerMenu isOpen={ui.mobileMenuOpen} onclick={() => ui.toggleMobileMenu()} />
			</div>

			<!-- Center: Brand -->
			<a
				href="/"
				class="shrink-0"
			>
				<img src={logo} alt="BANGLAPUNK" class="h-8 w-auto" />
			</a>

			<!-- Desktop Nav Links (Hidden on Mobile) -->
			<div class="hidden md:flex items-center gap-8">
				{#each navLinks as link}
					<a
						href={link.href}
						class="text-sm font-bold uppercase tracking-wider transition-colors"
						class:text-white={currentPath === link.href}
						class:text-gray-400={currentPath !== link.href}
						class:hover:text-white={currentPath !== link.href}
					>
						{link.label}
					</a>
				{/each}
			</div>

			<!-- Right: Cart Icon with Badge -->
			<button
				onclick={() => ui.toggleCartSheet()}
				class="relative p-2 rounded-full hover:bg-white/10 transition-colors"
				aria-label="Open cart"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="text-white"
				>
					<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
					<path d="M3 6h18"></path>
					<path d="M16 10a4 4 0 0 1-8 0"></path>
				</svg>

				<!-- Cart Count Badge -->
				{#if cart.itemCount > 0}
					<span
						class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold"
					>
						{cart.itemCount}
					</span>
				{/if}
			</button>
		</div>
	</div>
</nav>
