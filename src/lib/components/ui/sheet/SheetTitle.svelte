<script lang="ts">
	import { Dialog } from 'bits-ui';

	let { children, class: className = '' } = $props<{
		children: any;
		class?: string;
	}>();
</script>

<Dialog.Title
	class="text-4xl font-extrabold uppercase tracking-tight text-white {className}"
>
	{@render children()}
</Dialog.Title>
