<script lang="ts">
	let {
		size,
		available = true,
		selected = false,
		class: className = ''
	} = $props<{
		size: string;
		available?: boolean;
		selected?: boolean;
		class?: string;
	}>();
</script>

<div
	class="w-8 h-8 flex items-center justify-center border border-black rounded text-xs font-bold transition-colors
    {available
		? 'cursor-pointer hover:bg-black hover:text-white'
		: 'cursor-not-allowed opacity-50 relative overflow-hidden'}
    {selected ? 'bg-black text-white' : 'bg-white text-black'}
    {className}"
	role="option"
	aria-selected={selected}
	aria-disabled={!available}
>
	{size}
	{#if !available}
		<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
			<div class="w-full h-[1px] bg-black rotate-45"></div>
		</div>
	{/if}
</div>
