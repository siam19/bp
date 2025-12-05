/**
 * UI State Management (Svelte 5 Runes)
 * Global state for UI elements like modals and sheets
 */

class UIState {
	cartSheetOpen = $state<boolean>(false);
	mobileMenuOpen = $state<boolean>(false);

	openCartSheet(): void {
		this.cartSheetOpen = true;
	}

	closeCartSheet(): void {
		this.cartSheetOpen = false;
	}

	toggleCartSheet(): void {
		this.cartSheetOpen = !this.cartSheetOpen;
	}

	openMobileMenu(): void {
		this.mobileMenuOpen = true;
	}

	closeMobileMenu(): void {
		this.mobileMenuOpen = false;
	}

	toggleMobileMenu(): void {
		this.mobileMenuOpen = !this.mobileMenuOpen;
	}
}

export const ui = new UIState();
