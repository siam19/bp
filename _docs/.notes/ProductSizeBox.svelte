<script>
    let { size } = $props();
    let isOverflow = $derived(size.toString().startsWith('+'));
</script>

<div class={
    `h-7 w-7 rounded-sm text-xs flex items-center justify-center border-2
    ${isOverflow 
        ? 'bg-gray-200 text-gray-500 border-gray-200 font-bold' 
        : 'text-gray-600 bg-gray-100 border-gray-300'}`
}>
    {size}
</div>