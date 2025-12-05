<script lang="ts">
	let { children, class: className = '' } = $props<{
		children: any;
		class?: string;
	}>();
</script>

<div class="px-6 py-6 border-b border-white/10 {className}">
	{@render children()}
</div>
