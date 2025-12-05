/**
 * Cart State Management (Svelte 5 Runes)
 * Singleton store for global shopping cart state with localStorage persistence
 */

import type { CartItem } from '$lib/types';

class CartState {
	items = $state<CartItem[]>([]);

	constructor() {
		// Load from localStorage on initialization (client-side only)
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('bp-cart');
			if (stored) {
				try {
					this.items = JSON.parse(stored);
				} catch (e) {
					console.error('Failed to parse cart from localStorage', e);
				}
			}
		}
	}

	private save(): void {
		if (typeof window !== 'undefined') {
			localStorage.setItem('bp-cart', JSON.stringify(this.items));
		}
	}

	get total(): number {
		return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	}

	get itemCount(): number {
		return this.items.reduce((sum, item) => sum + item.quantity, 0);
	}

	addItem(item: CartItem): void {
		const existingIndex = this.items.findIndex((i) => i.variantId === item.variantId);

		if (existingIndex !== -1) {
			// Update quantity if item already exists
			this.items[existingIndex].quantity += item.quantity;
		} else {
			// Add new item
			this.items.push(item);
		}
		this.save();
	}

	removeItem(variantId: string): void {
		this.items = this.items.filter((item) => item.variantId !== variantId);
		this.save();
	}

	updateQuantity(variantId: string, quantity: number): void {
		const item = this.items.find((i) => i.variantId === variantId);
		if (item) {
			if (quantity <= 0) {
				this.removeItem(variantId);
			} else {
				item.quantity = quantity;
				this.save();
			}
		}
	}

	clear(): void {
		this.items = [];
		this.save();
	}
}

export const cart = new CartState();
