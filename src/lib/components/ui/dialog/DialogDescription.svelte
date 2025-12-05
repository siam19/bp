<script lang="ts">
	let { children, class: className = '' } = $props<{
		children: any;
		class?: string;
	}>();
</script>

<p class="text-sm text-gray-400 mt-2 {className}">
	{@render children()}
</p>
