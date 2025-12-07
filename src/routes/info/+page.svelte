<script lang="ts">
	import TabNavigation from '$lib/components/site/TabNavigation.svelte';
	import RichText from '$lib/components/ui/RichText.svelte';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import { resolveShopImage } from '$lib/utils/media';
	import type { ShopImage } from '$lib/types';

	let { data }: { data: PageData } = $props();

	// Transform API tabs to UI tabs
	let tabs = $derived(
		data.infoPage.tabs.map((tab, index) => ({
			id: index.toString(),
			label: tab.label,
			content: tab.content
		}))
	);

	let activeTabId = $state('0');

	// Get active content based on activeTabId
	let activeContent = $derived(tabs.find((t) => t.id === activeTabId)?.content || []);

	// Card corner logic based on active tab index
	let cardClasses = $derived.by(() => {
		const index = parseInt(activeTabId);
		const isFirst = index === 0;
		const isLast = index === tabs.length - 1;

		if (isFirst) return 'rounded-tl-none rounded-tr-2xl';
		if (isLast) return 'rounded-tl-2xl rounded-tr-none';
		return 'rounded-tl-2xl rounded-tr-2xl';
	});
</script>

<div class="mx-auto flex min-h-screen max-w-md flex-col bg-[#050505] pb-10 shadow-2xl shadow-black">
	<main class="flex flex-1 flex-col px-4 pt-24">
		<h1 class="mb-8 px-2 font-sans text-4xl font-black uppercase tracking-tight text-white">
			Info
		</h1>

		<!-- Tabs -->
		<TabNavigation {tabs} bind:activeTab={activeTabId} />

		<!-- Content Card -->
		<div
			class="info-card relative z-10 flex-1 rounded-bl-2xl rounded-br-2xl bg-[#161616] p-6 shadow-lg transition-all {cardClasses}"
		>
			{#key activeTabId}
				<div in:fade={{ duration: 300 }} class="h-full">
					{#each activeContent as block}
						{#if block.blockType === 'generic_section'}
							{#if block.sections}
								{#each block.sections as section}
									<div class="mb-8 last:mb-0">
										{#if section.title}
											<h2 class="mb-4 text-2xl font-black uppercase text-white">{section.title}</h2>
										{/if}
										<RichText content={section.body} />
									</div>
								{/each}
							{/if}
						{:else if block.blockType === 'policy_section'}
							<div class="prose prose-invert prose-sm max-w-none text-gray-400">
								{#if block.policies}
									{#each block.policies as policy}
										<div class="mb-6 last:mb-0">
											<h3 class="mb-2 font-bold uppercase text-white">{policy.title}</h3>
											<p class="text-xs leading-relaxed">{policy.content}</p>
										</div>
									{/each}
								{/if}
							</div>
						{:else if block.blockType === 'team_section'}
							<div>
								<div class="space-y-4">
									{#if block.members}
										{#each block.members as member}
											<div
												class="flex items-center gap-4 rounded-xl border border-gray-800 bg-[#0a0a0a] p-3"
											>
												<div class="h-12 w-12 overflow-hidden rounded-full bg-gray-700">
													{#if member.avatar}
														<img
															src={resolveShopImage(member.avatar as ShopImage)}
															alt={member.name}
															class="h-full w-full object-cover"
														/>
													{:else}
														<div
															class="flex h-full w-full items-center justify-center bg-gray-800 text-xs text-gray-500"
														>
															?
														</div>
													{/if}
												</div>
												<div>
													<p class="font-bold text-white">{member.name}</p>
													<p class="text-xs text-gray-500">{member.role}</p>
												</div>
											</div>
										{/each}
									{/if}
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
					class="font-bold text-teal-400 hover:text-teal-300">Bastok</a
				>
			</p>
		</div>
	</main>
</div>

<style>
	.info-card {
		min-height: 400px;
	}
</style>

