<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { ChevronLeft, EyeOff, Copy, AlertTriangle } from 'lucide-svelte';

	// --- State ---
	let orderId = $state($page.params.orderId);
	let status = $state($page.url.searchParams.get('status') || 'confirmed'); // 'pending' | 'confirmed'
	let isUnlocked = $state(false);
	let showModal = $state(false);
	
	// Modal Form State
	let phone = $state('');
	let key = $state('');
	let errorMsg = $state('');
	let resendMsg = $state('');
	let isResending = $state(false);

	// Mock Order Data
	const order = {
		id: orderId,
		total: 2300,
		items: [
			{
				name: 'Camio Shirt in Red',
				size: 'S',
				qty: 1,
				price: 1500,
				image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=200&auto=format&fit=crop'
			},
			{
				name: 'Cargo Pants',
				size: '30',
				qty: 1,
				price: 800,
				image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=200&auto=format&fit=crop'
			}
		],
		receiver: {
			name: 'Ishmam Ahmed',
			phone: '01711-XXXXXX',
			address: 'House 42, Road 7, Block C, Banani, Dhaka-1213',
			backup: '01822-XXXXXX'
		},
		tracking: {
			id: 'STEAD-998877',
			status: 'IN_REVIEW',
			updated: '10 mins ago'
		}
	};

	// --- Actions ---
	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
		// Ideally show a toast here
	}

	function openKeyModal() {
		if (isUnlocked) return;
		showModal = true;
		errorMsg = '';
		resendMsg = '';
		key = '';
	}

	function closeKeyModal() {
		showModal = false;
	}

	async function handleUnlock(e: Event) {
		e.preventDefault();
		errorMsg = '';
		
		// Mock Validation
		if (phone.length >= 11 && key === '1234') {
			isUnlocked = true;
			showModal = false;
		} else {
			errorMsg = 'Invalid Phone or Key';
		}
	}

	async function handleResend() {
		if (!phone || phone.length < 11) {
			errorMsg = 'Enter valid phone number first';
			return;
		}
		
		isResending = true;
		await new Promise(r => setTimeout(r, 1500));
		isResending = false;
		resendMsg = 'New key sent to your number!';
		
		setTimeout(() => {
			resendMsg = '';
		}, 3000);
	}
</script>

<div class="mx-auto flex min-h-screen max-w-md flex-col pb-10 shadow-2xl shadow-black">
	
	<!-- Navbar -->
	<nav class="fixed left-0 right-0 top-0 z-40 mx-auto flex w-full max-w-md items-center justify-between bg-gradient-to-b from-black/90 to-transparent px-4 py-4 pointer-events-none">
		<button class="pointer-events-auto text-white hover:text-gray-300" onclick={() => window.location.href='/'}>
			<ChevronLeft class="h-6 w-6" />
		</button>
		<div class="text-xl font-extrabold tracking-tighter text-white">RECEIPT</div>
		<div class="w-6"></div> 
	</nav>

	<main class="flex flex-1 flex-col space-y-6 px-4 pt-20">

		{#if status === 'pending'}
			<!-- PENDING PAYMENT VIEW (bKash Guide) -->
			<div class="space-y-6" in:fade>
				<div class="rounded-xl border border-pink-900/30 bg-pink-950/10 p-6 text-center">
					<h1 class="mb-2 text-2xl font-black uppercase text-pink-500">Payment Pending</h1>
					<p class="text-sm text-gray-400">Please complete your bKash payment to confirm this order.</p>
				</div>

				<!-- Step 1 -->
				<div class="space-y-2">
					<h2 class="text-sm font-bold uppercase text-gray-500">Step 1: Send Money</h2>
					<div class="flex items-center justify-between rounded-xl border border-[#262626] bg-[#161616] p-4">
						<div>
							<p class="text-xs text-gray-500">bKash Personal Number</p>
							<p class="font-mono text-xl font-bold text-white">01533817247</p>
						</div>
						<button onclick={() => copyToClipboard('01533817247')} class="rounded-lg bg-[#262626] p-2 text-gray-400 hover:bg-[#333] hover:text-white">
							<Copy size={20} />
						</button>
					</div>
					<p class="text-xs text-gray-500">Use the "Send Money" option in your bKash App.</p>
				</div>

				<!-- Step 2 -->
				<div class="space-y-2">
					<h2 class="text-sm font-bold uppercase text-gray-500">Step 2: Use Reference</h2>
					<div class="flex items-center justify-between rounded-xl border border-[#262626] bg-[#161616] p-4">
						<div>
							<p class="text-xs text-gray-500">Reference ID</p>
							<p class="font-mono text-xl font-bold text-white">{orderId}</p>
						</div>
						<button onclick={() => copyToClipboard(orderId)} class="rounded-lg bg-[#262626] p-2 text-gray-400 hover:bg-[#333] hover:text-white">
							<Copy size={20} />
						</button>
					</div>
					<div class="flex gap-2 rounded-lg bg-yellow-900/20 p-3 text-yellow-500">
						<AlertTriangle size={16} class="shrink-0 mt-0.5" />
						<p class="text-xs font-bold">IMPORTANT: You MUST use this Order ID as the Reference, otherwise our system cannot track your payment automatically.</p>
					</div>
				</div>

				<div class="pt-8 text-center">
					<p class="text-xs text-gray-500">You can close this tab. You will receive an SMS with a link to this page once payment is confirmed.</p>
				</div>
			</div>

		{:else}
			<!-- STANDARD RECEIPT VIEW (Confirmed) -->
			<div in:fade>
				<!-- Header -->
				<div class="mb-6 flex items-start justify-between">
					<div>
						<h1 class="mb-1 text-3xl font-black uppercase tracking-tight text-white">Receipt</h1>
						<p class="font-mono text-xs text-gray-500">ID: <span class="text-gray-300">#{orderId}</span></p>
					</div>
					<div class="flex h-16 w-20 items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1744.4 1004.8" class="h-full w-full">
							<path fill="#dbdbdb" d="M1221.9,514.8c-60.1,141.1-107.1-27.7-136.2-30-34.5,19-96.9,126-140.9,65.4-46.3-63.9,32.2-183.7,78.7-229.9,79.2-78.8,92.1,23.6,147.2,69.7l65.1-111.2,19.3-4.2c13.4,5.7,37,67.3,47.2,84.7,5.9,10-1.4,19.5,19.2,15.2.6-79.1-83.9-216.6,19.5-254.2,42.4,48.9,20.9,121.7,27,180.6,6.7,64.2,50.3,199.4.3,248.2-61.7,60.3-118.8-50.5-146.6-34.3Z"/>
							<path fill="#dbdbdb" d="M1621.7,883.8c-34.2-4.1-65.8,24.2-89.1,30.7-71.3,19.8-168.8-113.6-211.8,16.4-10.3,4.2-18.5-.4-26.7-6.3-63.2-44.8-50.3-282.8-3.6-345.3,38.6-24.6,46,71.4,81.6,71.3,29.8-.1,101.8-119,170.6-67.4,60,45-32.6,111-41.7,157.9,5.7,31.1,160.1,80.7,120.8,142.7Z"/>
							<path fill="#dbdbdb" d="M1180.3,608.7c27.6,29.6,10.3,73.1,9.8,102.6-.6,34.7,8.1,102-12.1,127.1-10.6,13.2-74.8,57.6-90.8,53.6-23.8-6-78.4-112.7-102-107.3l-43.7,91.8c-26.3,9-53.9-18.8-59.3-43.2-7-31.1,10.1-236.5,29.8-249.5,47.8,1.3,49.7,73.9,81.3,107.5,65,69.1,60.2-27.4,82.6-63.4,20.8-33.4,75.6-50.2,104.5-19.2Z"/>
							<path fill="#dbdbdb" d="M945.2,333.6c.7,2.3,24.4,13.2,12.7,41.1-15.2,15.5-110.5-62.5-137.1-67.9-40.8-8.4-92.2-3.2-133.7-1.8-16.3-42.7,62.6-61.3,68.9-82.4s-14.3-34.9-12.7-51.8c5-52.9,124.2-99.8,164.5-127.4,20.6,0,70,135,72.8,157.9,9,74.3-61.4,46.6-35.4,132.3Z"/>
							<path fill="#dbdbdb" d="M786.8,638.8c23.6,14.6,27.5,127.5,22.4,155.8-6.4,35.4-60.9,111.8-96.5,120.1-64.7,14.9-58.9-9.3-95.6-32.7-26.1-16.6-52.4-18.1-65.4-50.6-14.1-35.3-29.5-207.4,23.4-207.8l7.7,5.9c34.2,20.9,71,210.5,127.9,151.8,20.3-21,17.5-178.7,76.1-142.5Z"/>
							<path fill="#dbdbdb" d="M646.1,206.6c15.6,19.4,23.6,97.1,25.4,125.5,2.5,38.5,6.3,136.3,0,170-4.2,21.9-77.6,83.6-92.3,73.4-56.3-91-33.3-182.9-39-282.2-1.1-19.3-14.7-38.4-13.5-52.9,2.3-28.8,55.9-75.9,82.8-63.4,2.1,1,35.2,27.7,36.7,29.6Z"/>
							<path fill="#dbdbdb" d="M1424.1,535.3c-17.7-19-29.7-208.5-33.7-248.7-5.1-50.6-28-95.8-1-149.8,25.4-50.7,73.2,35.1,81.8,61.2,15.9,48.4,26.5,229,20.7,281.1-3.7,32.8-36.5,89.7-67.8,56.2Z"/>
							<path fill="#dbdbdb" d="M885.4,377.8c95.4,65.1-58.9,213-153.9,188.3-18.5-4.8-59-31.9-33-52.5,17.4-13.8,59.1-29.6,84-47.5,25.2-18.1,46.5-47.9,74.7-60.7-13.9-59.3-161.7,28.5-162.5-26.5,10.8-77.1,150.2-28.7,190.6-1Z"/>
							<path fill="#dbdbdb" d="M488.2,260.1c-23.7-74-31.6-115.8-120.4-100.3-82.5,14.4-155,115.4-194.6,184.5-10.9,19-31.5,42.1-26.4,63.1,4,16.4,45.8,59.5,60.4,71.9,69,58.4,139.5,105.4,228.9,119.3,14.7,2.3,30.3,1.4,45-.6,10.5-3.6,23.3-51.8,26.3-66.6,21.4-108.7,14.7-165.8-19.1-271.3ZM373.5,437.1c-18.8,1.9-56.4-34.8-58.1-51.1-1.9-17.8,29.9-62.6,42.9-65.5,20.3-4.6,51,113.5,15.2,116.6Z"/>
							<path fill="#dbdbdb" d="M437.8,651.1c-68-24-103,11.5-165.1,2.5-17.4-2.5-33.9-18.9-45.7-15.8-17.7,4.6-12.8,72.8-12.2,89.3,1.6,45.7,9.2,149.2,17.6,191.4,6.2,31.4,35.8,64.8,69.9,58.6,69.5-12.7,40.6-94.4,67.3-126.8,18-21.7,83.8-31.6,116.5-61.5,62.4-57.1,17.3-114.6-48.2-137.7ZM332.6,736.1c4-35.3,64-32.6,82-19.6,37.9,27.4-91.3,102.6-82,19.6Z"/>
						</svg>
					</div>
				</div>

				<!-- 1. Deliver To (LOCKED) -->
				<div class="mb-6">
					<label class="mb-2 block text-xs font-bold uppercase text-gray-500">Deliver To</label>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class="relative min-h-[100px] overflow-hidden rounded-xl border border-gray-800 bg-[#111]" onclick={openKeyModal}>
						{#if !isUnlocked}
							<div class="absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-center border border-[#333] bg-black/85 backdrop-blur-sm transition-colors hover:bg-black/80 hover:border-[#555]">
								<EyeOff class="mb-2 h-6 w-6 text-gray-400" />
								<span class="text-xs font-bold uppercase tracking-wide text-gray-500">Enter KEY to view</span>
							</div>
						{/if}
						
						<div class="space-y-1 p-4 transition-all duration-300" class:blur-sm={!isUnlocked} class:opacity-50={!isUnlocked}>
							<h3 class="text-lg font-bold text-white">{order.receiver.name}</h3>
							<p class="text-sm text-gray-400">{order.receiver.phone}</p>
							<p class="text-xs text-gray-500">{order.receiver.address}</p>
							<p class="mt-2 text-[10px] text-gray-600">Backup: {order.receiver.backup}</p>
						</div>
					</div>
				</div>

				<!-- 2. Status (OPEN) -->
				<div class="mb-6">
					<label class="mb-2 block text-xs font-bold uppercase text-gray-500">Status</label>
					<div class="rounded-xl border border-gray-800 bg-[#111] p-4">
						<div class="mb-2 flex items-center gap-3">
							<div class="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.7)]"></div>
							<h3 class="text-lg font-black uppercase tracking-wide text-white">Confirmed</h3>
						</div>
						<p class="text-xs font-medium text-gray-500">Waiting for delivery pickup</p>
						
						<div class="mt-4 flex h-1 w-full overflow-hidden rounded-full bg-gray-800">
							<div class="h-full w-1/3 bg-gray-600"></div> <!-- Pending -->
							<div class="h-full w-1/3 bg-blue-600"></div> <!-- Confirmed -->
							<div class="h-full w-1/3 bg-gray-800"></div> <!-- Delivered -->
						</div>
					</div>
				</div>

				<!-- 3. Parcel Tracking (LOCKED) -->
				<div class="mb-6">
					<label class="mb-2 block text-xs font-bold uppercase text-gray-500">Parcel Tracking</label>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class="relative min-h-[120px] overflow-hidden rounded-xl border border-gray-800 bg-[#111]" onclick={openKeyModal}>
						{#if !isUnlocked}
							<div class="absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-center border border-[#333] bg-black/85 backdrop-blur-sm transition-colors hover:bg-black/80 hover:border-[#555]">
								<EyeOff class="mb-2 h-6 w-6 text-gray-400" />
								<span class="text-xs font-bold uppercase tracking-wide text-gray-500">Enter KEY to view</span>
							</div>
						{/if}

						<div class="flex h-full flex-col items-center justify-center space-y-2 p-4 text-center transition-all duration-300" class:blur-sm={!isUnlocked} class:opacity-50={!isUnlocked}>
							<div class="font-mono text-xs text-gray-400">Tracking ID: {order.tracking.id}</div>
							<div class="rounded bg-gray-800 px-3 py-1 text-xs text-white">Status: {order.tracking.status}</div>
							<p class="text-[10px] text-gray-500">Last updated: {order.tracking.updated} via Steadfast API</p>
						</div>
					</div>
				</div>

				<!-- 4. Items (OPEN) -->
				<div class="mb-6">
					<label class="mb-2 block text-xs font-bold uppercase text-gray-500">Items</label>
					<div class="space-y-3">
						{#each order.items as item}
							<div class="flex gap-3 rounded-xl border border-gray-800 bg-[#111] p-3">
								<div class="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-300">
									<img src={item.image} alt={item.name} class="h-full w-full object-cover opacity-80 mix-blend-multiply" />
								</div>
								<div class="flex flex-1 flex-col justify-center">
									<h4 class="text-sm font-bold leading-tight text-white">{item.name}</h4>
									<div class="mt-1 flex items-center gap-3 font-mono text-[10px] text-gray-400">
										<span>Size: {item.size}</span>
										<span>Qty: {item.qty}</span>
									</div>
								</div>
								<div class="flex items-center">
									<span class="font-mono text-lg font-bold text-white">{item.price}<span class="ml-0.5 align-top text-[10px] text-gray-500">BDT</span></span>
								</div>
							</div>
						{/each}
					</div>
					
					<div class="mt-4 flex items-center justify-between px-2">
						<span class="text-xs font-bold uppercase text-gray-500">Total Paid</span>
						<span class="font-mono text-xl font-black text-white">{order.total}<span class="ml-1 text-xs text-gray-500">BDT</span></span>
					</div>
				</div>

				<!-- 5. Inquiry (LOCKED) -->
				<div>
					<label class="mb-2 block text-xs font-bold uppercase text-gray-500">For Any Query Message Us</label>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class="relative min-h-[60px] overflow-hidden rounded-xl border border-gray-800 bg-[#111]" onclick={openKeyModal}>
						{#if !isUnlocked}
							<div class="absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-center border border-[#333] bg-black/85 backdrop-blur-sm transition-colors hover:bg-black/80 hover:border-[#555]">
								<EyeOff class="mb-2 h-6 w-6 text-gray-400" />
								<span class="text-xs font-bold uppercase tracking-wide text-gray-500">Enter KEY to view</span>
							</div>
						{/if}

						<div class="p-4 transition-all duration-300" class:blur-sm={!isUnlocked} class:opacity-50={!isUnlocked}>
							<div class="flex gap-2">
								<input type="text" placeholder="Write message to sales..." class="flex-1 rounded-lg border border-gray-700 bg-[#0a0a0a] px-3 py-2 text-sm text-white focus:outline-none" />
								<button class="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-200">SEND</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

	</main>
</div>

<!-- Security Key Modal -->
{#if showModal}
	<div class="fixed inset-0 z-60 flex items-center justify-center p-4" in:fade={{ duration: 200 }}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="absolute inset-0 bg-black/90 backdrop-blur-md" onclick={closeKeyModal}></div>
		
		<div class="relative w-full max-w-sm rounded-xl border border-gray-700 bg-[#161616] p-6 shadow-2xl" in:fly={{ y: 20, duration: 300 }}>
			<div class="mb-6 text-center">
				<h3 class="text-lg font-bold text-white">Confirm Identity</h3>
				<p class="mt-1 text-xs text-gray-500">Verify your identity to view sensitive details.</p>
			</div>

			<form onsubmit={handleUnlock} class="space-y-4">
				<div>
					<label for="access-phone" class="mb-1 block text-xs font-bold uppercase text-gray-500">Phone Number</label>
					<input 
						type="tel" 
						id="access-phone" 
						bind:value={phone}
						class="w-full rounded-lg border border-gray-600 bg-[#0a0a0a] px-4 py-3 font-mono text-sm text-white placeholder-gray-700 focus:border-white focus:outline-none" 
						placeholder="01711XXXXXX" 
						required 
					/>
				</div>

				<div>
					<div class="mb-1 flex items-center justify-between">
						<label for="access-key" class="block text-xs font-bold uppercase text-gray-500">SMS Key</label>
						<button type="button" onclick={handleResend} disabled={isResending} class="cursor-pointer text-[10px] font-bold uppercase text-blue-400 hover:text-blue-300 disabled:cursor-not-allowed disabled:text-gray-500">
							{isResending ? 'Sending...' : 'Resend SMS'}
						</button>
					</div>
					<input 
						type="password" 
						id="access-key" 
						bind:value={key}
						maxlength="4" 
						class="w-full rounded-lg border border-gray-600 bg-[#0a0a0a] px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] indent-[0.5em] text-white placeholder-gray-700 focus:border-white focus:outline-none" 
						placeholder="••••" 
						required 
					/>
				</div>

				<button type="submit" class="mt-2 w-full rounded-lg bg-white py-3 text-lg font-black uppercase tracking-wide text-black transition-colors hover:bg-gray-200">
					UNLOCK
				</button>
				
				{#if errorMsg}
					<div class="mt-2 text-center text-xs font-bold text-red-500" in:fade>{errorMsg}</div>
				{/if}
				{#if resendMsg}
					<div class="mt-2 text-center text-xs font-bold text-green-500" in:fade>{resendMsg}</div>
				{/if}
			</form>
		</div>
	</div>
{/if}
