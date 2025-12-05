<script lang="ts">
	import type { Drop } from '$lib/types';
	import Countdown from './Countdown.svelte';

	let { drop } = $props<{ drop: Drop }>();

	let releaseDate = $derived(new Date(drop.release_date));
</script>

<div class="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-8 text-center">
	<!-- Background Blur/Image -->
	{#if drop.assets?.banners?.[0]}
		<div class="absolute inset-0 opacity-20">
			<img
				src={drop.assets.banners[0].url}
				alt=""
				class="h-full w-full object-cover blur-sm grayscale"
			/>
		</div>
	{/if}

	<div class="relative z-10 flex flex-col items-center gap-6">
		<div class="space-y-2">
			<span class="text-sm font-bold uppercase tracking-widest text-blue-400">Next Drop</span>
			<h2 class="text-3xl font-black uppercase tracking-tighter text-white sm:text-4xl">
				{drop.name}
			</h2>
		</div>

		<Countdown targetDate={releaseDate} label="Launches in" />

		<button
			class="rounded-full bg-white px-8 py-3 text-sm font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 hover:bg-gray-200"
			onclick={() => alert('Notify Me Modal - Coming Soon')}
		>
			Notify Me
		</button>
	</div>
</div>
