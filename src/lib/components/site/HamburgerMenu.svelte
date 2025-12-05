<script lang="ts">
	let { isOpen = false, onclick } = $props<{
		isOpen?: boolean;
		onclick?: () => void;
	}>();
</script>

<button
	{onclick}
	class="p-2 rounded-lg hover:bg-red-500 transition-colors group"
	aria-label="Toggle menu"
>
	<div class="w-6 h-5 flex flex-col justify-between">
		<!-- Top Line -->
		<span
			class="w-full h-0.5 bg-white transform transition-all duration-300 origin-left"
			class:rotate-45={isOpen}
			class:translate-y-0={isOpen}
		></span>

		<!-- Middle Line -->
		<span
			class="w-full h-0.5 bg-white transition-all duration-300"
			class:opacity-0={isOpen}
		></span>

		<!-- Bottom Line -->
		<span
			class="w-full h-0.5 bg-white transform transition-all duration-300 origin-left"
			class:-rotate-45={isOpen}
			class:-translate-y-0={isOpen}
		></span>
	</div>
</button>
