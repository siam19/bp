<!-- THE UPDATED CART SHEET SHOULD OPEN FROM LEFT -->



<script lang="ts">
	import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '$lib/components/ui/sheet';
	import { cart } from '$lib/stores/cart.svelte';

	let { open = $bindable(false) } = $props<{ open: boolean }>();

	function checkout() {
		alert('Checkout functionality would be implemented here!');
		cart.clear();
		open = false;
	}

	function removeItem(id: string) {
		cart.removeItem(id);
	}
</script>

<Sheet bind:open>
	<SheetContent
		side="bottom"
		preventScroll={false}
		portalProps={{ to: 'body' }}
		class="fixed inset-x-0 bottom-0 h-[80vh] flex flex-col bg-black halftone-overlay border-t-2 border-t-gray-500 text-gray-100 z-50"
	>
		<SheetHeader class="text-left ">
			<SheetTitle class="text-4xl mt-4 text-center -mb-4 pb-0 font-extrabold text-white">Cart</SheetTitle>
			<!-- TODO: Add close icon here -->
		</SheetHeader>

		<div class="flex-1 overflow-y-auto pt-8 pb-4">
			{#if cart.items.length === 0}
				<div class="flex flex-col items-center justify-center h-full text-gray-500">
					<p class="text-lg">Your cart is empty</p>
					<p class="text-sm">Add some items to get started!</p>
				</div>
			{:else}
				<div class="space-y-4 mx-4 py-2">
					{#each cart.items as item (item.id)}
						<div class="cart-item ">
							<img
								src={item.image}
								alt={item.name}
								class="cart-item__image"
							/>
							<div class="cart-item__content">
								<h3 class="cart-item__title">{item.name}</h3>
								<p class="text-xs text-gray-400 uppercase">Size: {item.variantName}</p>
								<p class="cart-item__meta">Quantity: {item.quantity}</p>
								<p class="cart-item__price">
									{(item.price * item.quantity).toFixed(2)} BDT
								</p>
							</div>
							<button
								onclick={() => removeItem(item.id)}
								class="cart-item__remove cursor-pointer"
								aria-label="Remove item"
							>
								<svg
									class="cart-item__remove-icon"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									></path>
								</svg>
							</button>
						</div>
					{/each}
				</div>

				
			{/if}
		</div>

		<SheetFooter class="flex space-x-4 pt-4 ">
			<!-- Cart Summary -->
				<div class="mt-6 p-6 text-white">
					<div class="flex justify-between items-center">
						<span class="text-lg font-semibold">Total:</span>
						<span class="text-xl font-bold">{cart.total.toFixed(2)} BDT</span>
					</div>
				</div>
			<!-- <SheetClose>
				<button class="flex-1 px-6 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
					Close
				</button>
			</SheetClose> -->
			<button
				onclick={checkout}
				class="flex-1 px-6 py-3 cursor-pointer bg-gradient-to-b from-zinc-500 to-zinc-800 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
				disabled={cart.items.length === 0}
			>
				Checkout
			</button>
		</SheetFooter>
	</SheetContent>
</Sheet>