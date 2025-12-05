<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/site/Navbar.svelte';
	import CartSheet from '$lib/components/site/CartSheet.svelte';
	import MobileMenuSheet from '$lib/components/site/MobileMenuSheet.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Halftone Overlay -->
<div class="halftone-overlay"></div>

<!-- Navigation -->
<Navbar />

<!-- Cart Sheet -->
<CartSheet />

<!-- Mobile Menu Sheet -->
<MobileMenuSheet />

<!-- Main Content -->
<main class="relative z-10">
	{@render children()}
</main>

