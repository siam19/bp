<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { cart } from '$lib/stores/cart.svelte';
	import { ChevronLeft, Loader2 } from 'lucide-svelte';

	let isSubmitting = $state(false);
	let orderId = $state('');
	
	// Form State
	let formData = $state({
		name: '',
		phone: '',
		address: '',
		notes: '',
		timeframe: ''
	});
	
	let paymentMethod = $state('cod');

	onMount(() => {
		// Generate Order ID
		orderId = 'BP-' + Math.floor(Math.random() * 10000) + '-XM';
		
		// Mock Background Visit Creation
		console.log("[TRACKING] Unique Visitor created in 'visits' collection.");
		console.log("[TRACKING] Cart Items:", cart.items);
	});

	async function handleCheckout(e: Event) {
		e.preventDefault();
		isSubmitting = true;

		// Mock Backend Payload
		const payload = {
			orderId: orderId,
			customer: {
				name: formData.name,
				phone: formData.phone,
				address: formData.address,
				notes: formData.notes,
				timeframe: formData.timeframe
			},
			payment: paymentMethod,
			items: cart.items,
			timestamp: new Date().toISOString()
		};

		console.log("[BACKEND] Creating Order...", payload);
		console.log("[TRACKING] User added to 'Customers' collection.");

		// Mock Network Delay
		await new Promise(r => setTimeout(r, 2000));

		// Redirect Logic
		const status = paymentMethod === 'cod' ? 'confirmed' : 'pending';
		goto(`/receipt/${orderId}?status=${status}`);
	}
</script>

<div class="mx-auto flex min-h-screen max-w-md flex-col bg-[#050505] pb-10 shadow-2xl shadow-black">
	<!-- Navbar -->
	<nav class="fixed left-0 right-0 top-0 z-40 mx-auto flex w-full max-w-md items-center justify-between bg-gradient-to-b from-black/90 to-transparent px-4 py-4 pointer-events-none">
		<button class="pointer-events-auto text-white hover:text-gray-300" onclick={() => history.back()}>
			<ChevronLeft class="h-6 w-6" />
		</button>
		<div class="text-xl font-extrabold tracking-tighter text-white">CHECKOUT</div>
		<div class="w-6"></div> 
	</nav>

	<main class="flex flex-1 flex-col px-4 pt-24">
		<h1 class="mb-6 font-sans text-3xl font-black uppercase tracking-tight text-white">Delivery Info</h1>

		<form onsubmit={handleCheckout} class="space-y-6">
			
			<!-- Required Info -->
			<div class="checkout-card space-y-4 rounded-2xl bg-[#161616] p-5">
				<div>
					<label for="field-name" class="mb-1 block text-xs font-bold uppercase text-gray-500">Receiver Name <span class="text-red-500">*</span></label>
					<input 
						type="text" 
						id="field-name" 
						bind:value={formData.name}
						required
						class="input-inset w-full rounded-lg border border-[#262626] bg-[#0a0a0a] p-3 text-white placeholder-gray-700 focus:border-gray-500 focus:outline-none" 
						placeholder="Full Name" 
					/>
				</div>
				<div>
					<label for="field-phone" class="mb-1 block text-xs font-bold uppercase text-gray-500">Phone Number <span class="text-red-500">*</span></label>
					<input 
						type="tel" 
						id="field-phone" 
						bind:value={formData.phone}
						required
						class="input-inset w-full rounded-lg border border-[#262626] bg-[#0a0a0a] p-3 text-white placeholder-gray-700 focus:border-gray-500 focus:outline-none" 
						placeholder="017..." 
					/>
				</div>
				<div>
					<label for="field-address" class="mb-1 block text-xs font-bold uppercase text-gray-500">Address <span class="text-red-500">*</span></label>
					<textarea 
						id="field-address" 
						rows="3" 
						bind:value={formData.address}
						required
						class="input-inset w-full resize-none rounded-lg border border-[#262626] bg-[#0a0a0a] p-3 text-white placeholder-gray-700 focus:border-gray-500 focus:outline-none" 
						placeholder="House, Road, Area..."
					></textarea>
				</div>
			</div>

			<!-- Optional Info -->
			<div class="checkout-card space-y-4 rounded-2xl bg-[#161616] p-5">
				<div>
					<label for="field-notes" class="mb-1 block text-xs font-bold uppercase text-gray-500">Delivery Notes <span class="ml-1 rounded bg-gray-800 px-1 text-[10px] font-normal normal-case text-gray-400">Optional</span></label>
					<input 
						type="text" 
						id="field-notes" 
						bind:value={formData.notes}
						class="input-inset w-full rounded-lg border border-[#262626] bg-[#0a0a0a] p-3 text-white placeholder-gray-700 focus:border-gray-500 focus:outline-none" 
						placeholder="Leave at guard post..."
					/>
				</div>
				<div>
					<label class="mb-2 block text-xs font-bold uppercase text-gray-500">Preferred Timeframe <span class="ml-1 rounded bg-gray-800 px-1 text-[10px] font-normal normal-case text-gray-400">Optional</span></label>
					<div class="space-y-2">
						{#each [
							{ value: 'morning', label: 'Morning', sub: '10AM - 1PM' },
							{ value: 'afternoon', label: 'Afternoon', sub: '2PM - 6PM' },
							{ value: 'evening', label: 'Evening', sub: '6PM - 9PM' }
						] as option}
							<label class="group flex cursor-pointer items-center justify-between rounded-lg border border-[#262626] bg-[#0a0a0a] p-3 transition-all hover:border-gray-500"
								class:bg-white={formData.timeframe === option.value}
								class:text-black={formData.timeframe === option.value}
								class:border-white={formData.timeframe === option.value}
								class:text-white={formData.timeframe !== option.value}
							>
								<span class="text-sm font-medium">
									{option.label} <span class="ml-1 text-xs opacity-70">({option.sub})</span>
								</span>
								<input type="radio" name="timeframe" value={option.value} bind:group={formData.timeframe} class="sr-only" />
								<div class="h-4 w-4 rounded-full border border-current p-0.5">
									{#if formData.timeframe === option.value}
										<div class="h-full w-full rounded-full bg-current"></div>
									{/if}
								</div>
							</label>
						{/each}
					</div>
				</div>
			</div>

			<!-- Payment Method -->
			<div>
				<h2 class="mb-3 text-xl font-bold uppercase text-white">Payment Method</h2>
				<div class="flex gap-3">
					<!-- COD Option -->
					<label class="group flex-1 cursor-pointer">
						<input type="radio" name="payment" value="cod" bind:group={paymentMethod} class="sr-only" />
						<div class="input-inset flex h-24 flex-col items-center justify-center rounded-xl border border-[#262626] bg-[#0a0a0a] p-4 transition-all group-hover:border-gray-500"
							class:bg-white={paymentMethod === 'cod'}
							class:text-black={paymentMethod === 'cod'}
							class:border-white={paymentMethod === 'cod'}
						>
							<span class="text-lg font-black">COD</span>
							<span class="mt-1 text-[10px] uppercase tracking-wide opacity-70">Cash on Delivery</span>
						</div>
					</label>
					
					<!-- bKash Option -->
					<label class="group flex-1 cursor-pointer">
						<input type="radio" name="payment" value="bkash" bind:group={paymentMethod} class="sr-only" />
						<div class="input-inset flex h-24 flex-col items-center justify-center rounded-xl border border-[#262626] bg-[#0a0a0a] p-4 transition-all group-hover:border-gray-500"
							class:bg-white={paymentMethod === 'bkash'}
							class:text-black={paymentMethod === 'bkash'}
							class:border-white={paymentMethod === 'bkash'}
						>
							<span class="text-lg font-black text-pink-500" class:text-black={paymentMethod === 'bkash'}>bKash</span>
							<span class="mt-1 text-[10px] uppercase tracking-wide opacity-70">Send Money</span>
						</div>
					</label>
				</div>
			</div>

			<!-- Submit Button -->
			<button 
				type="submit" 
				disabled={isSubmitting}
				class="mt-4 w-full rounded-xl bg-white py-4 text-lg font-black uppercase tracking-wide text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:bg-gray-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
			>
				{#if isSubmitting}
					<Loader2 class="mx-auto h-5 w-5 animate-spin" />
				{:else}
					Proceed to Pay
				{/if}
			</button>

		</form>
	</main>
</div>
