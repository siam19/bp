<script lang="ts">
	import type { MediaAsset } from '$lib/types';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	let { banners } = $props<{ banners: MediaAsset[] }>();

	let currentIndex = $state(0);
	let timer: ReturnType<typeof setInterval>;

	function nextSlide() {
		currentIndex = (currentIndex + 1) % banners.length;
	}

	function prevSlide() {
		currentIndex = (currentIndex - 1 + banners.length) % banners.length;
	}

	function goToSlide(index: number) {
		currentIndex = index;
		resetTimer();
	}

	function resetTimer() {
		clearInterval(timer);
		timer = setInterval(nextSlide, 5000);
	}

	onMount(() => {
		if (banners.length > 1) {
			timer = setInterval(nextSlide, 5000);
		}
		return () => clearInterval(timer);
	});
</script>

<div class="relative aspect-video w-full overflow-hidden bg-gray-900 sm:aspect-[21/9]">
	{#each banners as banner, i (banner.id || i)}
		{#if i === currentIndex}
			<div
				class="absolute inset-0 h-full w-full"
				transition:fade={{ duration: 500 }}
			>
				<img
					src={banner.url}
					alt={banner.alt || 'Drop Banner'}
					class="h-full w-full object-cover"
				/>
				<!-- Gradient Overlay -->
				<div class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
			</div>
		{/if}
	{/each}

	<!-- Indicators -->
	{#if banners.length > 1}
		<div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
			{#each banners as _, i}
				<button
					onclick={() => goToSlide(i)}
					class="h-1.5 rounded-full transition-all {i === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'}"
					aria-label="Go to slide {i + 1}"
				></button>
			{/each}
		</div>
	{/if}
</div>
