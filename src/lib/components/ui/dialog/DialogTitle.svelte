<script lang="ts">
	let { children, class: className = '' } = $props<{
		children: any;
		class?: string;
	}>();
</script>

<h2 class="text-2xl font-bold text-white {className}">
	{@render children()}
</h2>
