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
				<img src={logo} alt="BANGLAPUNK" class="h-8 w-auto scale-125" />
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
					viewBox="0 0 64 64"
					width="32"
					height="32"
					class="text-white"
				>
					<defs>
						<style>
							.st0 {
								fill: currentColor;
							}
						</style>
					</defs>
					<path class="st0" d="M24.6,51.1c2.3,4.3-1.7,9.1-6.4,7.7-4.9-1.5-4.9-8.7,0-10.2L11,16c-.1-.4-.5-.8-.9-.8-1.2-.2-3.9.3-4.8-.2-1.1-.6-.9-2.3.2-2.5.7-.2,4.1-.1,5,0,2,.2,3.2,2.2,3.5,4h19.1c.2.1.4.2.5.4.3.4.7,3.1,1,3.9,1.9,5.9,7.6,9.3,13.8,9,1.3,0,3-.9,3.1,1.2-.9,3.3-1,7.4-2,10.6-.3,1-1,1.9-2,2.4-.1,0-1,.4-1.1.4h-26.4l1,4h25.4c5.7.6,6.4,8.9.9,10.5-4.7,1.3-8.3-3.5-6.3-7.7h-16.5,0ZM21.3,55c1.7-1.8-.9-4.5-2.8-2.8s1,4.7,2.8,2.8ZM44.5,52.2c-1.6,1.6.4,4.3,2.4,3.1,2.5-1.6-.4-5-2.4-3.1Z"/>
					<path class="st0" d="M46.6,5.7c8.6-.6,14.3,9,9.7,16.3-4,6.5-13.6,6.8-17.9.4-4.7-6.9,0-16.1,8.2-16.7ZM48.5,15.1v-3.8c0-.4-.9-.9-1.3-.9-.4,0-1.2.6-1.2.9v3.8h-3.8c-.4,0-1,.9-.9,1.3,0,.4.6,1.2.9,1.2h3.8v3.8c0,.4.9,1,1.3.9.4,0,1.2-.6,1.2-.9v-3.8h3.8c.4,0,.8-.8.8-1.2,0-.4-.4-1.3-.8-1.3h-3.8Z"/>
				</svg>

				<!-- Cart Count Badge -->
				{#if cart.itemCount > 0}
					<span
						class="absolute top-1 right-1	 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold"
					>
						{cart.itemCount}
					</span>
				{/if}
			</button>
		</div>
	</div>
</nav>
