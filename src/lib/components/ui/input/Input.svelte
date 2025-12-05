<script lang="ts">
	let {
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		disabled = false,
		class: className = '',
		...restProps
	} = $props<{
		type?: string;
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		class?: string;
		[key: string]: any;
	}>();

	const baseClasses =
		'w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-2 rounded-lg outline-none transition-colors placeholder:text-gray-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed';
</script>

<input
	{type}
	bind:value
	{placeholder}
	{disabled}
	class="{baseClasses} {className}"
	{...restProps}
/>
