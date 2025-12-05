<script lang="ts">
	import type { Drop } from '$lib/types';

	let { status } = $props<{ status: Drop['status'] }>();
</script>

{#if status === 'ACTIVE'}
	<span class="badge-live">
		<span class="pulse-dot"></span>
		LIVE NOW
	</span>
{:else if status === 'SCHEDULED'}
	<span class="badge-upcoming">UPCOMING</span>
{:else if status === 'ARCHIVED'}
	<span class="badge-archived">ARCHIVED</span>
{/if}

<style>
	.badge-live {
		background: #ef4444;
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: bold;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-transform: uppercase;
	}

	.pulse-dot {
		width: 8px;
		height: 8px;
		background: white;
		border-radius: 50%;
		animation: pulse 1.5s ease-in-out infinite;
	}

	.badge-upcoming {
		background: #374151;
		color: #e5e7eb;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: bold;
		text-transform: uppercase;
		border: 1px solid #4b5563;
	}

	.badge-archived {
		background: rgba(0, 0, 0, 0.5);
		color: #9ca3af;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: bold;
		text-transform: uppercase;
		border: 1px solid #374151;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.5;
			transform: scale(1.2);
		}
	}
</style>
