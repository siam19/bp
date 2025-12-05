<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { fly, fade } from 'svelte/transition';

	let { children, class: className = '', side = 'right' } = $props<{
		children: any;
		class?: string;
		side?: 'left' | 'right';
	}>();
</script>

<Dialog.Portal>
	<Dialog.Overlay forceMount>
		{#snippet child({ props, open })}
			{#if open}
				<div
					{...props}
					class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
					transition:fade={{ duration: 200 }}
				></div>
			{/if}
		{/snippet}
	</Dialog.Overlay>

	<Dialog.Content forceMount>
		{#snippet child({ props, open })}
			{#if open}
				<div
					{...props}
					class="fixed z-50 h-full w-full max-w-md bg-black border-white/10 shadow-2xl outline-none flex flex-col
					{side === 'right' ? 'right-0 border-l' : 'left-0 border-r'} top-0
					{className}"
					transition:fly={{ x: side === 'right' ? 400 : -400, duration: 300 }}
				>
					<!-- Close Button (Absolute Top Left) -->
					<Dialog.Close
						class="absolute top-6 left-6 p-2 text-gray-400 hover:text-white focus:outline-none z-50 transition-colors"
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
						>
							<path d="M18 6 6 18" />
							<path d="m6 6 12 12" />
						</svg>
						<span class="sr-only">Close</span>
					</Dialog.Close>

					{@render children()}
				</div>
			{/if}
		{/snippet}
	</Dialog.Content>
</Dialog.Portal>
