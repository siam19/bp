<script lang="ts">
	type Tab = { id: string; label: string };
	let { tabs, activeTab = $bindable() } = $props<{ tabs: Tab[]; activeTab: string }>();
</script>

<div class="relative z-20 -mb-px flex w-full items-end">
	{#each tabs as tab, i}
		{@const isActive = activeTab === tab.id}
		{@const isFirst = i === 0}
		{@const isLast = i === tabs.length - 1}

		<button
			class="tab-btn flex-1 py-3 font-bold transition-colors duration-200 select-none focus:outline-none"
			class:active={isActive}
			class:text-white={isActive}
			class:text-gray-500={!isActive}
			class:hover:text-gray-300={!isActive}
			class:scoop-right={isActive && isFirst}
			class:scoop-left={isActive && isLast}
			class:scoop-left-right={isActive && !isFirst && !isLast}
			onclick={() => (activeTab = tab.id)}
			type="button"
		>
			{tab.label}
		</button>
	{/each}
</div>

<style>
	:global(:root) {
		--card-bg: #161616;
	}

	.tab-btn {
		position: relative;
		background: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tab-btn.active {
		background-color: var(--card-bg);
		color: white;
		border-top-left-radius: 1rem;
		border-top-right-radius: 1rem;
		z-index: 10;
	}

	/* Scoop Effects */
	.tab-btn.active.scoop-left::before,
	.tab-btn.active.scoop-left-right::before {
		content: '';
		position: absolute;
		bottom: 0;
		left: -20px;
		width: 20px;
		height: 20px;
		background: transparent;
		border-bottom-right-radius: 20px;
		box-shadow: 4px 4px 0 4px var(--card-bg);
		z-index: 10;
		pointer-events: none;
	}

	.tab-btn.active.scoop-right::after,
	.tab-btn.active.scoop-left-right::after {
		content: '';
		position: absolute;
		bottom: 0;
		right: -20px;
		width: 20px;
		height: 20px;
		background: transparent;
		border-bottom-left-radius: 20px;
		box-shadow: -4px 4px 0 4px var(--card-bg);
		z-index: 10;
		pointer-events: none;
	}
</style>
