<script lang="ts">
	import { Dialog } from 'bits-ui';

	let { children, class: className = '' } = $props<{
		children: any;
		class?: string;
	}>();
</script>

<Dialog.Description class="text-sm text-gray-400 {className}">
	{@render children()}
</Dialog.Description>
