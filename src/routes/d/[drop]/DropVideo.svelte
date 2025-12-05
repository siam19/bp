<script lang="ts">
	import { Play, Pause } from 'lucide-svelte';

	let { videoUrl } = $props<{ videoUrl: string }>();

	let videoElement = $state<HTMLVideoElement | null>(null);
	let isPlaying = $state(false);
	let showControls = $state(true);

	function togglePlayback() {
		if (!videoElement) return;

		if (isPlaying) {
			videoElement.pause();
		} else {
			videoElement.play();
		}
		isPlaying = !isPlaying;
	}

	function handleVideoClick() {
		togglePlayback();
	}

	// Hide controls after play starts
	$effect(() => {
		if (isPlaying) {
			const timeout = setTimeout(() => (showControls = false), 2000);
			return () => clearTimeout(timeout);
		} else {
			showControls = true;
		}
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<div
	class="relative aspect-video cursor-pointer overflow-hidden rounded-xl bg-black"
	onclick={handleVideoClick}
	onmouseenter={() => (showControls = true)}
	onmouseleave={() => isPlaying && (showControls = false)}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === ' ' && togglePlayback()}
>
	<video
		bind:this={videoElement}
		src={videoUrl}
		class="h-full w-full object-cover"
		loop
		playsinline
		muted
	></video>

	<!-- Overlay (visible when paused or hovering) -->
	{#if showControls}
		<div
			class="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity"
		>
			<button
				class="flex h-16 w-16 items-center justify-center rounded-full bg-white/90"
				onclick={(e) => {
					e.stopPropagation();
					togglePlayback();
				}}
			>
				{#if isPlaying}
					<Pause class="h-8 w-8 text-black" />
				{:else}
					<Play class="ml-1 h-8 w-8 text-black" />
				{/if}
			</button>
		</div>
	{/if}
</div>
