<script lang="ts">
	let { children, class: className = '' } = $props<{
		children: any;
		class?: string;
	}>();
</script>

<div class="px-6 py-4 border-t border-white/10 flex justify-end gap-2 {className}">
	{@render children()}
</div>
