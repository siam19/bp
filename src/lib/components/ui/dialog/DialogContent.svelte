<script lang="ts">
	let { children, class: className = '' } = $props<{
		children: any;
		class?: string;
	}>();
</script>

<div class="px-6 py-4 {className}">
	{@render children()}
</div>
