<script lang="ts">
	import TabNavigation from '$lib/components/site/TabNavigation.svelte';
	import { fade } from 'svelte/transition';
	import { MEDIA_BASE_URL } from '$lib/utils/media';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Build tabs array from API data
	let tabs = $derived(
		data.tabs.map((tab, i) => ({
			id: `tab-${i}`,
			label: tab.label
		}))
	);

	let activeTab = $state('tab-0');

	// Get the active tab's content
	let activeContent = $derived(data.tabs[tabs.findIndex((t) => t.id === activeTab)]?.content ?? []);

	// Card corner logic based on active tab position
	let cardClasses = $derived.by(() => {
		const activeIndex = tabs.findIndex((t) => t.id === activeTab);
		if (activeIndex === 0) return 'rounded-tl-none rounded-tr-2xl';
		if (activeIndex === tabs.length - 1) return 'rounded-tl-2xl rounded-tr-none';
		return 'rounded-tl-2xl rounded-tr-2xl';
	});

	// Helper to get media URL from avatar
	function getAvatarUrl(avatar: any): string {
		if (!avatar) return '';
		if (typeof avatar === 'string') return avatar;
		// Shop API format: { filename, thumbnail: { filename } }
		if (avatar.thumbnail?.filename) return `${MEDIA_BASE_URL}${avatar.thumbnail.filename}`;
		if (avatar.filename) return `${MEDIA_BASE_URL}${avatar.filename}`;
		return '';
	}
</script>

<main class="flex min-h-screen flex-1 flex-col px-4 pt-10">
	<!-- <h1 class="mb-8 px-2 font-sans text-4xl font-black uppercase tracking-tight text-white">Info</h1> -->

	<!-- Tabs Navigation -->
	<TabNavigation {tabs} bind:activeTab />

	<!-- Content Card -->
	<div
		class="info-card relative z-10 flex-1 rounded-bl-2xl rounded-br-2xl p-6 shadow-lg transition-all {cardClasses}"
		style="background-color: var(--card-bg, #161616); min-height: 400px;"
	>
		{#key activeTab}
			<div class="tab-content" in:fade={{ duration: 200 }}>
				{#each activeContent as block}
					{#if block.type === 'generic'}
						<!-- Generic Section -->
						<div class="flex h-full flex-col items-center justify-center space-y-12 py-10 text-center">
							{#each block.sections ?? [] as section}
								<div>
									{#if section.title}
										<h2 class="mb-2 font-sans text-xl font-bold uppercase tracking-wide text-gray-300">
											{section.title}
										</h2>
									{/if}
									{#if section.body}
										<p class="mx-auto max-w-[280px] whitespace-pre-line text-sm leading-relaxed text-gray-500">
											{section.body}
										</p>
									{/if}
									{#if section.image}
										{@const imgUrl = typeof section.image === 'string' ? section.image : section.image?.url}
										{#if imgUrl}
											<div class="mt-4 h-32 w-full overflow-hidden rounded-lg bg-gray-800">
												<img src={imgUrl} alt={section.title ?? 'Section image'} class="h-full w-full object-cover opacity-60" />
											</div>
										{/if}
									{/if}
								</div>
							{/each}
						</div>
					{:else if block.type === 'policy'}
						<!-- Policy Section -->
						<div class="prose prose-invert prose-sm max-w-none text-gray-400">
							{#each block.policies ?? [] as policy}
								<h3 class="mb-2 font-bold uppercase text-white">{policy.title}</h3>
								<p class="mb-4 text-xs">{policy.content}</p>
							{/each}
						</div>
					{:else if block.type === 'team'}
						<!-- Team Section -->
						<div>
							<h2 class="mb-6 text-2xl font-black uppercase text-white">The Crew</h2>
							<div class="space-y-4">
								{#each block.members ?? [] as member}
									<div class="flex items-center gap-4 rounded-xl border border-gray-800 bg-[#0a0a0a] p-3">
										<div class="h-12 w-12 overflow-hidden rounded-full bg-gray-700">
											{#if member.avatar}
												<img
													src={getAvatarUrl(member.avatar)}
													alt={member.name}
													class="h-full w-full object-cover"
												/>
											{/if}
										</div>
										<div>
											<h3 class="text-sm font-bold text-white">{member.name} | {member.role}</h3>
											<p class="text-xs text-gray-500">{member.role}</p>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{/key}
	</div>

	<!-- Footer -->
	<div class="py-8 text-center font-mono text-[10px] text-gray-600">
		<p>Banglapunk Copyright 2026</p>
		<p class="mt-1">
			Website made by <a
				href="https://instagram.com/bastok._"
				target="_blank"
				rel="noopener noreferrer"
				class="font-bold text-teal-400 hover:text-teal-300">Bastok</a
			>
		</p>
	</div>
</main>

<style>
	:global(:root) {
		--card-bg: #161616;
	}

	.tab-content {
		animation: fadeIn 0.3s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
