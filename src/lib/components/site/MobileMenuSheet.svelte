<script lang="ts">
	import { Sheet, SheetContent, SheetHeader, SheetTitle } from '$lib/components/ui/sheet';
	import { ui } from '$lib/stores/ui.svelte';

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/p', label: 'Products' },
		{ href: '/d', label: 'Drops' },
		{ href: '/info', label: 'Info' },
		{ href: '/contact', label: 'Contact' }
	];

	function handleLinkClick() {
		ui.closeMobileMenu();
	}
</script>

<Sheet bind:open={ui.mobileMenuOpen}>
	<SheetContent side="left" class="bg-black">
		<!-- <SheetHeader>
			<SheetTitle>Menu</SheetTitle>
		</SheetHeader> -->

		<div class="flex-1 flex flex-col justify-center gap-8 px-6 py-12">
			{#each navLinks as link}
				<a
					href={link.href}
					onclick={handleLinkClick}
					class="text-3xl uppercase text-white hover:text-red-500 transition-colors"
				>
					{link.label}
				</a>
			{/each}
		</div>
	</SheetContent>
</Sheet>
