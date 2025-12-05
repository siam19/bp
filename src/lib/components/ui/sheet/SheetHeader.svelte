<script lang="ts">
	let { children, class: className = '' } = $props<{
		children: any;
		class?: string;
	}>();
</script>

<div class="border-b border-white/10 px-6 py-6 {className}">
	{@render children()}
</div>
