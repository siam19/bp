<script lang="ts">
	import TabNavigation from '$lib/components/site/TabNavigation.svelte';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { Paperclip, X, Search, Upload } from 'lucide-svelte';
	import { payloadClient } from '$lib/api/payload';

	let activeTab = $state('sales');

	const tabs = [
		{ id: 'sales', label: 'Sales' },
		{ id: 'admin', label: 'Admin' },
		{ id: 'tech', label: 'Tech' }
	];

	// Card corner logic
	let cardClasses = $derived.by(() => {
		if (activeTab === 'sales') return 'rounded-tl-none rounded-tr-2xl';
		if (activeTab === 'tech') return 'rounded-tl-2xl rounded-tr-none';
		return 'rounded-tl-2xl rounded-tr-2xl';
	});

	// Form State
	let formData = $state({
		name: '',
		phone: '',
		email: '',
		subject: '',
		subjectOther: '',
		message: '',
		attachment: null as { type: 'product' | 'file'; name: string; file?: File } | null
	});

	let isSubmitting = $state(false);
	let submitStatus = $state<'idle' | 'success' | 'error'>('idle');
	let showProductSearch = $state(false);
	let productSearchQuery = $state('');

	// Mock Products for Search
	const mockProducts = ['Piuma Jacket', 'Cyber Tee', 'Neon Hoodie', 'Cargo Pants'];
	let filteredProducts = $derived(
		mockProducts.filter((p) => p.toLowerCase().includes(productSearchQuery.toLowerCase()))
	);

	// LocalStorage Logic
	const LS_KEY = 'banglapunk_contact_draft';

	onMount(() => {
		const saved = localStorage.getItem(LS_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				formData = { ...formData, ...parsed };
			} catch (e) {
				console.error('Failed to restore draft', e);
			}
		}
	});

	function saveDraft() {
		// Don't save file objects to LS
		const { attachment, ...rest } = formData;
		localStorage.setItem(LS_KEY, JSON.stringify(rest));
	}

	function handleInput() {
		saveDraft();
	}

	function attachProduct(name: string) {
		formData.attachment = { type: 'product', name };
		showProductSearch = false;
		productSearchQuery = '';
		saveDraft();
	}

	function handleFileUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const file = input.files[0];
			formData.attachment = { type: 'file', name: file.name, file };
			// Can't save file to LS easily
		}
	}

	function removeAttachment() {
		formData.attachment = null;
		saveDraft();
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		
		// Rate Limit Check
		const lastSubmit = localStorage.getItem('last_submit_time');
		const now = Date.now();
		if (lastSubmit && now - parseInt(lastSubmit) < 60000) {
			alert('Please wait a minute before sending another message.');
			return;
		}

		isSubmitting = true;

		try {
			await payloadClient.createContactRequest({
				name: formData.name,
				contact_info: `Phone: ${formData.phone}, Email: ${formData.email}`,
				department: activeTab === 'sales' ? 'Sales' : activeTab === 'admin' ? 'Admin' : 'Tech',
				subject: formData.subject === 'Other' ? formData.subjectOther : formData.subject,
				message: formData.message
				// Attachments not supported in public API yet
			});

			localStorage.setItem('last_submit_time', now.toString());
			localStorage.removeItem(LS_KEY);
			
			isSubmitting = false;
			submitStatus = 'success';

			setTimeout(() => {
				window.location.href = '/';
			}, 3000);
		} catch (err) {
			console.error(err);
			alert('Failed to send message. Please try again.');
			isSubmitting = false;
		}
	}
</script>

<div class="mx-auto flex min-h-screen max-w-md flex-col bg-[#050505] pb-10 shadow-2xl shadow-black">
	<main class="flex flex-1 flex-col px-4 pt-24">
		<h1 class="mb-8 px-2 font-sans text-4xl font-black uppercase tracking-tight text-white">
			Contact
		</h1>

		<TabNavigation {tabs} bind:activeTab />

		<div
			class="contact-card relative z-10 flex-1 rounded-bl-2xl rounded-br-2xl bg-[#161616] p-6 shadow-lg transition-all {cardClasses}"
		>
			{#if submitStatus === 'success'}
				<div class="flex h-full flex-col items-center justify-center text-center" in:fade>
					<h2 class="text-2xl font-bold text-green-400">Thank you!</h2>
					<p class="mt-2 text-gray-400">We'll be in touch shortly.</p>
				</div>
			{:else}
				<form onsubmit={handleSubmit} class="flex h-full flex-col space-y-6" in:fade>
					<!-- Name -->
					<div class="space-y-1">
						<label for="name" class="text-xs font-bold uppercase text-gray-500">Name</label>
						<input
							type="text"
							id="name"
							bind:value={formData.name}
							oninput={handleInput}
							required
							class="input-inset w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-white placeholder-gray-600 focus:border-gray-500 focus:outline-none focus:ring-0"
							placeholder="Your Name"
						/>
					</div>

					<!-- Contact Info -->
					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-1">
							<div class="flex justify-between">
								<label for="phone" class="text-xs font-bold uppercase text-gray-500">Phone</label>
								{#if formData.email && !formData.phone}
									<span class="text-[10px] text-gray-600">Optional</span>
								{/if}
							</div>
							<input
								type="tel"
								id="phone"
								bind:value={formData.phone}
								oninput={handleInput}
								required={!formData.email}
								class="input-inset w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-white placeholder-gray-600 focus:border-gray-500 focus:outline-none focus:ring-0"
								placeholder="017..."
							/>
						</div>
						<div class="space-y-1">
							<div class="flex justify-between">
								<label for="email" class="text-xs font-bold uppercase text-gray-500">Email</label>
								{#if formData.phone && !formData.email}
									<span class="text-[10px] text-gray-600">Optional</span>
								{/if}
							</div>
							<input
								type="email"
								id="email"
								bind:value={formData.email}
								oninput={handleInput}
								required={!formData.phone}
								class="input-inset w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-white placeholder-gray-600 focus:border-gray-500 focus:outline-none focus:ring-0"
								placeholder="you@example.com"
							/>
						</div>
					</div>

					<!-- Subject -->
					<div class="space-y-1">
						<label for="subject" class="text-xs font-bold uppercase text-gray-500">Subject</label>
						{#if activeTab === 'sales'}
							<div class="relative">
								<select
									id="subject"
									bind:value={formData.subject}
									onchange={handleInput}
									class="input-inset w-full appearance-none rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-white focus:border-gray-500 focus:outline-none focus:ring-0"
								>
									<option value="" disabled selected>Select Topic...</option>
									<option value="return">Return / Exchange</option>
									<option value="cancel">Cancel Order</option>
									<option value="shipping">Shipping Inquiry</option>
									<option value="other">Other</option>
								</select>
								<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
									<svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
										<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
									</svg>
								</div>
							</div>
							{#if formData.subject === 'other'}
								<input
									type="text"
									bind:value={formData.subjectOther}
									oninput={handleInput}
									placeholder="Please specify..."
									class="input-inset mt-2 w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-white placeholder-gray-600 focus:border-gray-500 focus:outline-none focus:ring-0"
									required
								/>
							{/if}
						{:else}
							<input
								type="text"
								bind:value={formData.subject}
								oninput={handleInput}
								class="input-inset w-full rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-white placeholder-gray-600 focus:border-gray-500 focus:outline-none focus:ring-0"
								placeholder={activeTab === 'admin' ? 'Partnership, Press...' : 'Bug report, Feature request...'}
							/>
						{/if}
					</div>

					<!-- Message -->
					<div class="space-y-1">
						<div class="flex justify-between">
							<label for="message" class="text-xs font-bold uppercase text-gray-500">Message</label>
							<span class="text-[10px] text-gray-600">{formData.message.length}/2000</span>
						</div>
						<textarea
							id="message"
							bind:value={formData.message}
							oninput={handleInput}
							required
							maxlength="2000"
							rows="5"
							class="input-inset w-full resize-none rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-white placeholder-gray-600 focus:border-gray-500 focus:outline-none focus:ring-0"
							placeholder="How can we help?"
						></textarea>
					</div>

					<!-- Attachments -->
					<div class="space-y-1">
						<div class="text-xs font-bold uppercase text-gray-500">Attachment</div>
						
						{#if formData.attachment}
							<div class="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 p-3">
								<div class="flex items-center gap-3">
									<div class="flex h-8 w-8 items-center justify-center rounded bg-gray-700 text-gray-400">
										<Paperclip size={16} />
									</div>
									<div>
										<p class="text-sm font-medium text-white">{formData.attachment.name}</p>
										<p class="text-[10px] uppercase text-gray-500">{formData.attachment.type}</p>
									</div>
								</div>
								<button type="button" onclick={removeAttachment} class="text-gray-500 hover:text-white">
									<X size={16} />
								</button>
							</div>
						{:else if activeTab === 'tech'}
							<label class="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-700 bg-[#0a0a0a] py-4 text-sm text-gray-500 hover:border-gray-500 hover:text-gray-300">
								<Upload size={16} />
								<span>Upload Screenshot</span>
								<input type="file" class="hidden" accept="image/*" onchange={handleFileUpload} />
							</label>
						{:else}
							<div class="relative">
								<div class="flex items-center rounded-lg border border-[#262626] bg-[#0a0a0a] px-3">
									<Search size={16} class="text-gray-600" />
									<input
										type="text"
										placeholder="Search product..."
										class="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-gray-600 focus:outline-none"
										bind:value={productSearchQuery}
										onfocus={() => showProductSearch = true}
									/>
								</div>
								
								{#if showProductSearch && productSearchQuery}
									<div class="absolute left-0 right-0 top-full z-20 mt-1 max-h-40 overflow-y-auto rounded-lg border border-gray-800 bg-[#1a1a1a] shadow-xl">
										{#each filteredProducts as product}
											<button
												type="button"
												class="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
												onmousedown={() => attachProduct(product)}
											>
												{product}
											</button>
										{/each}
										{#if filteredProducts.length === 0}
											<div class="px-4 py-2 text-sm text-gray-500">No products found</div>
										{/if}
									</div>
								{/if}
							</div>
						{/if}
					</div>

					<!-- Submit -->
					<div class="pt-4">
						<button
							type="submit"
							disabled={isSubmitting}
							class="w-full rounded-lg bg-white py-4 font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isSubmitting ? 'Sending...' : 'Send Message'}
						</button>
					</div>
				</form>
			{/if}
		</div>
	</main>
</div>

<style>
	.contact-card {
		min-height: 500px;
	}
</style>
