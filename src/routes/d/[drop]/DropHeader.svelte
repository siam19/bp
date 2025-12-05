<script lang="ts">
	let { name, description } = $props<{ name: string; description?: string }>();
</script>

<div class="space-y-4 px-4 text-center">
	<h1 class="text-4xl font-black uppercase tracking-tight text-white">
		{name}
	</h1>

	{#if description}
		<p class="mx-auto max-w-prose text-gray-400">
			{description}
		</p>
	{/if}
</div>
