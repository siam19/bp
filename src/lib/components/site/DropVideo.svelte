<script lang="ts">
	import { Play, Pause } from 'lucide-svelte';

	let { url } = $props<{ url: string }>();
	let video = $state<HTMLVideoElement>();
	let paused = $state(true);

	function getEmbedUrl(inputUrl: string): string {
		try {
			const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
			const match = inputUrl.match(ytRegex);
			if (match && match[1]) {
				return `https://www.youtube.com/embed/${match[1]}`;
			}
			return inputUrl;
		} catch (e) {
			return inputUrl;
		}
	}

	let embedUrl = $derived(getEmbedUrl(url));

	function togglePlay() {
		if (!video) return;
		if (video.paused) {
			video.play();
			paused = false;
		} else {
			video.pause();
			paused = true;
		}
	}
</script>

<div class="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900 group">
	{#if url.includes('youtube') || url.includes('youtu.be')}
		<iframe
			src={embedUrl}
			title="Drop Video"
			class="absolute inset-0 h-full w-full"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe>
	{:else}
		<!-- svelte-ignore a11y_media_has_caption -->
		<video
			bind:this={video}
			src={url}
			class="h-full w-full object-cover"
			onclick={togglePlay}
			onended={() => (paused = true)}
		></video>

		<button
			onclick={togglePlay}
			class="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity hover:bg-black/40 {paused
				? 'opacity-100'
				: 'opacity-0'}"
			aria-label={paused ? 'Play video' : 'Pause video'}
		>
			<div
				class="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-transform hover:scale-110"
			>
				{#if paused}
					<Play class="ml-1 h-8 w-8 text-white" fill="currentColor" />
				{:else}
					<Pause class="h-8 w-8 text-white" fill="currentColor" />
				{/if}
			</div>
		</button>
	{/if}
</div>
