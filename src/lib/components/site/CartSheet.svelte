<script lang="ts">
	import {
		Sheet,
		SheetContent,
		SheetHeader,
		SheetFooter,
		SheetTitle,
		SheetDescription
	} from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { ui } from '$lib/stores/ui.svelte';
	import { cart } from '$lib/stores/cart.svelte';

	function formatPrice(price: number): string {
		return `৳${price.toLocaleString('en-BD')}`;
	}

	function handleCheckout() {
		ui.closeCartSheet();
		window.location.href = '/checkout';
	}
</script>

<Sheet bind:open={ui.cartSheetOpen}>
	<SheetContent class="bg-black">
		<SheetHeader class="flex flex-col items-end text-right pt-12">
			<SheetTitle>CART</SheetTitle>
			<SheetDescription>
				{cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
			</SheetDescription>
		</SheetHeader>

		<div class="flex-1 overflow-y-auto px-6 py-6">
			{#if cart.items.length === 0}
				<!-- Empty State -->
				<div class="flex flex-col items-center justify-center h-full text-center py-12">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="64"
						height="64"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-gray-600 mb-4"
					>
						<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
						<path d="M3 6h18"></path>
						<path d="M16 10a4 4 0 0 1-8 0"></path>
					</svg>
					<p class="text-gray-400 text-sm">Your cart is empty</p>
					<Button
						variant="ghost"
						class="mt-4"
						onclick={() => {
							ui.closeCartSheet();
							window.location.href = '/p';
						}}
					>
						Browse Products
					</Button>
				</div>
			{:else}
				<!-- Cart Items -->
				<div class="space-y-4">
					{#each cart.items as item (item.variantId)}
						<div
							class="bg-neutral-900/40 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex gap-4"
						>
							<!-- Product Image -->
							<div class="w-20 h-20 shrink-0 rounded-md overflow-hidden bg-gray-200">
								<img src={item.image} alt={item.productName} class="w-full h-full object-cover" />
							</div>

							<!-- Product Info -->
							<div class="flex-1 min-w-0">
								<h4 class="text-white font-semibold text-sm truncate">
									{item.productName}
								</h4>
								<p class="text-gray-400 text-xs mt-1">
									{item.variantName}
								</p>
								<p class="text-white font-bold text-sm mt-2">
									{formatPrice(item.price)}
								</p>
							</div>

							<!-- Quantity Controls -->
							<div class="flex flex-col items-end justify-between">
								<button
									onclick={() => cart.removeItem(item.variantId)}
									class="text-gray-400 hover:text-red-500 transition-colors"
									aria-label="Remove item"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M18 6 6 18"></path>
										<path d="m6 6 12 12"></path>
									</svg>
								</button>

								<div class="flex items-center gap-2 bg-neutral-800 rounded-md">
									<button
										onclick={() => cart.updateQuantity(item.variantId, item.quantity - 1)}
										class="w-7 h-7 flex items-center justify-center text-white hover:text-red-500 transition-colors"
										disabled={item.quantity <= 1}
									>
										−
									</button>
									<span class="text-white font-medium text-sm w-6 text-center">
										{item.quantity}
									</span>
									<button
										onclick={() => cart.updateQuantity(item.variantId, item.quantity + 1)}
										class="w-7 h-7 flex items-center justify-center text-white hover:text-red-500 transition-colors"
									>
										+
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		{#if cart.items.length > 0}
			<SheetFooter class="bg-neutral-900/60 backdrop-blur-md">
				<!-- Total -->
				<div class="flex justify-between items-center mb-4 px-6">
					<span class="text-gray-400 text-sm">Total</span>
					<span class="text-white font-bold text-2xl">{formatPrice(cart.total)}</span>
				</div>

				<!-- Checkout Button -->
				<button
					onclick={handleCheckout}
					class="w-full bg-white text-black font-bold py-4 rounded-none uppercase tracking-wider hover:bg-gray-200 transition-all mb-2"
				>
					Checkout
				</button>
				
				<!-- Close Button (Bottom) -->
				<button
					onclick={() => ui.closeCartSheet()}
					class="w-full bg-transparent border border-white/20 text-white font-bold py-4 rounded-none uppercase tracking-wider hover:bg-white/10 transition-all"
				>
					Close
				</button>
			</SheetFooter>
		{/if}
	</SheetContent>
</Sheet>
