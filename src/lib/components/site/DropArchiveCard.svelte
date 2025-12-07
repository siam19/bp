<script lang="ts">
	import { goto } from '$app/navigation';
	import StatusBadge from './StatusBadge.svelte';
	import type { DropStatus, ShopImage } from '$lib/types';
	import { resolveShopImage } from '$lib/utils/media';

	// Define the shape of data we expect for the card
	interface DropCardData {
		id: string;
		slug: string;
		name: string;
		status: DropStatus;
		release_date?: string;
		end_date?: string;
		banner: ShopImage | null;
	}

	let { drop } = $props<{ drop: DropCardData }>();

	let cardClass = $derived.by(() => {
		switch (drop.status) {
			case 'ACTIVE':
				return 'ring-2 ring-red-500 shadow-lg shadow-red-500/20';
			case 'SCHEDULED':
				return 'grayscale opacity-80 border border-gray-800';
			case 'ARCHIVED':
				return 'opacity-60';
			default:
				return '';
		}
	});

	function getCountdownText(d: DropCardData): string {
		const now = new Date();

		if (d.status === 'ACTIVE' && d.end_date) {
			const endDate = new Date(d.end_date);
			const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
			return `Ends in ${daysLeft} Day${daysLeft !== 1 ? 's' : ''}`;
		}

		if (d.status === 'SCHEDULED' && d.release_date) {
			const releaseDate = new Date(d.release_date);
			const daysUntil = Math.ceil((releaseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
			return `Launches in ${daysUntil} Day${daysUntil !== 1 ? 's' : ''}`;
		}

		if (d.status === 'ARCHIVED' && d.end_date) {
			return `Ended ${formatDate(d.end_date)}`;
		}

		return '';
	}

	function formatDate(isoString: string): string {
		return new Date(isoString).toLocaleDateString('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}

	function handleClick() {
		goto(`/d/${drop.slug}`);
	}
</script>

<button
	onclick={handleClick}
	class="relative aspect-video w-full overflow-hidden rounded-2xl text-left transition-transform hover:scale-[1.02] {cardClass}"
>
	<!-- Background Image -->
	<img
		src={resolveShopImage(drop.banner) || '/placeholder-drop.jpg'}
		alt={drop.name}
		class="absolute inset-0 h-full w-full object-cover"
	/>

	<!-- Gradient Overlay -->
	<div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>

	<!-- Content -->
	<div class="absolute inset-0 flex flex-col justify-between p-6">
		<!-- Badge -->
		<div class="self-start">
			<StatusBadge status={drop.status} />
		</div>

		<!-- Title & Countdown -->
		<div>
			<h3 class="mb-1 text-2xl font-bold text-white">{drop.name}</h3>
			<p class="text-sm text-gray-300">{getCountdownText(drop)}</p>
		</div>
	</div>
</button>
