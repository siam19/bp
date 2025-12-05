<script lang="ts">
	import { Dialog } from 'bits-ui';

	let { open = $bindable(false), children } = $props<{
		open?: boolean;
		children: any;
	}>();
</script>

<Dialog.Root bind:open>
	{@render children()}
</Dialog.Root>
