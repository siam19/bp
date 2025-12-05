<script lang="ts">
	import TabNavigation from '$lib/components/site/TabNavigation.svelte';
	import { fade } from 'svelte/transition';

	let activeTab = $state('drops');

	const tabs = [
		{ id: 'drops', label: 'Drops' },
		{ id: 'about', label: 'About Us' },
		{ id: 'policy', label: 'Policy' },
		{ id: 'team', label: 'Team' }
	];

	// Card corner logic based on active tab
	let cardClasses = $derived.by(() => {
		if (activeTab === 'drops') return 'rounded-tl-none rounded-tr-2xl';
		if (activeTab === 'team') return 'rounded-tl-2xl rounded-tr-none';
		return 'rounded-tl-2xl rounded-tr-2xl';
	});
</script>

<div class="mx-auto flex min-h-screen max-w-md flex-col bg-[#050505] pb-10 shadow-2xl shadow-black">
	<main class="flex flex-1 flex-col px-4 pt-24">
		<h1 class="mb-8 px-2 font-sans text-4xl font-black uppercase tracking-tight text-white">
			Info
		</h1>

		<!-- Tabs -->
		<TabNavigation {tabs} bind:activeTab />

		<!-- Content Card -->
		<div
			class="info-card relative z-10 flex-1 rounded-bl-2xl rounded-br-2xl bg-[#161616] p-6 shadow-lg transition-all {cardClasses}"
		>
			{#key activeTab}
				<div in:fade={{ duration: 300 }} class="h-full">
					{#if activeTab === 'drops'}
						<div class="flex h-full flex-col items-center justify-center py-10 text-center">
							<div class="mb-12">
								<h2 class="mb-2 font-sans text-xl font-bold uppercase tracking-wide text-gray-300">
									How Drops Work
								</h2>
								<p class="mx-auto max-w-[250px] text-sm leading-relaxed text-gray-500">
									Explanation about drops and their lifecycle. Limited quantities, limited time.
								</p>
							</div>

							<div>
								<h2 class="mb-2 font-sans text-xl font-bold uppercase tracking-wide text-gray-300">
									Get a Product From<br />Previous Drop
								</h2>
								<p class="mx-auto max-w-[280px] text-sm leading-relaxed text-gray-500">
									You can view products from previous drops. They won't be available to buy right
									now. BUT You can request restock and our team will get back to you when it's
									available again.
								</p>
							</div>
						</div>
					{:else if activeTab === 'about'}
						<div class="space-y-4 text-left">
							<h2 class="mb-4 text-2xl font-black uppercase text-white">About Banglapunk</h2>
							<p class="text-sm leading-relaxed text-gray-400">
								Banglapunk is more than a brand; it's a movement. Born from the chaotic energy of
								Dhaka's streets and fused with cyberpunk aesthetics, we craft apparel for the
								digital nomads and street samurais of tomorrow.
							</p>
							<p class="text-sm leading-relaxed text-gray-400">
								We reject fast fashion. We embrace the limited, the rare, and the raw. Our drops are
								temporal artifacts, meant to be collected and worn until the system crashes.
							</p>
							<div class="mt-4 h-32 w-full overflow-hidden rounded-lg bg-gray-800">
								<img
									src="https://images.unsplash.com/photo-1617137968427-85924c809a22?q=80&w=600&auto=format&fit=crop"
									alt="Banglapunk Mood"
									class="h-full w-full object-cover opacity-60"
								/>
							</div>
						</div>
					{:else if activeTab === 'policy'}
						<div class="prose prose-invert prose-sm max-w-none text-gray-400">
							<h3 class="mb-2 font-bold uppercase text-white">Return & Refund Policy</h3>
							<p class="mb-4 text-xs">
								Due to the limited nature of our drops, all sales are generally final. However, we
								accept returns for defective items or sizing exchanges within 7 days of delivery.
								Items must be unworn with tags attached.
							</p>

							<h3 class="mb-2 font-bold uppercase text-white">Shipping Information</h3>
							<p class="mb-4 text-xs">
								We ship globally. Domestic orders (BD) typically arrive within 3-5 business days.
								International shipping times vary by zone. Pre-order drops will include estimated
								shipping dates on the product page.
							</p>

							<h3 class="mb-2 font-bold uppercase text-white">Privacy Policy</h3>
							<p class="mb-4 text-xs">
								We respect your data. We only collect information necessary to process your order
								and notify you of drops. We do not sell your data to third-party corpo-rats.
							</p>

							<h3 class="mb-2 font-bold uppercase text-white">Terms of Service</h3>
							<p class="text-xs">
								By accessing Banglapunk, you agree to our terms. Botting our drops is strictly
								prohibited and will result in order cancellation and IP bans.
							</p>
						</div>
					{:else if activeTab === 'team'}
						<div>
							<h2 class="mb-6 text-2xl font-black uppercase text-white">The Crew</h2>

							<div class="space-y-4">
								<div class="flex items-center gap-4 rounded-xl border border-gray-800 bg-[#0a0a0a] p-3">
									<div class="h-12 w-12 overflow-hidden rounded-full bg-gray-700">
										<img
											src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
											alt="Team Member"
										/>
									</div>
									<div>
										<p class="font-bold text-white">Bastok</p>
										<p class="text-xs text-gray-500">Lead Developer</p>
									</div>
								</div>

								<div class="flex items-center gap-4 rounded-xl border border-gray-800 bg-[#0a0a0a] p-3">
									<div class="h-12 w-12 overflow-hidden rounded-full bg-gray-700">
										<img
											src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
											alt="Team Member"
										/>
									</div>
									<div>
										<p class="font-bold text-white">Aneka</p>
										<p class="text-xs text-gray-500">Creative Director</p>
									</div>
								</div>
							</div>
						</div>
					{/if}
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
