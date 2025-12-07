<script lang="ts">
	interface Props {
		content: any;
	}

	let { content }: Props = $props();

	function renderChildren(node: any): string {
		if (!node.children) return '';
		return node.children.map((child: any) => {
			if (child.text) {
				let text = child.text;
				if (child.bold) text = `<strong>${text}</strong>`;
				if (child.italic) text = `<em>${text}</em>`;
				if (child.underline) text = `<u>${text}</u>`;
				if (child.strikethrough) text = `<s>${text}</s>`;
				if (child.code) text = `<code>${text}</code>`;
				return text;
			}
			return '';
		}).join('');
	}
</script>

{#if content?.root?.children}
	{#each content.root.children as node}
		{#if node.type === 'paragraph'}
			<p class="mb-4 text-sm leading-relaxed text-gray-400">
				{@html renderChildren(node)}
			</p>
		{:else if node.type === 'heading'}
			{#if node.tag === 'h1'}
				<h1 class="mb-4 text-3xl font-black uppercase text-white">{@html renderChildren(node)}</h1>
			{:else if node.tag === 'h2'}
				<h2 class="mb-3 text-2xl font-bold uppercase text-white">{@html renderChildren(node)}</h2>
			{:else if node.tag === 'h3'}
				<h3 class="mb-2 text-xl font-bold uppercase text-white">{@html renderChildren(node)}</h3>
			{:else}
				<h4 class="mb-2 text-lg font-bold uppercase text-white">{@html renderChildren(node)}</h4>
			{/if}
		{:else if node.type === 'list'}
			{#if node.listType === 'bullet'}
				<ul class="mb-4 list-disc pl-5 text-sm text-gray-400">
					{#each node.children as listItem}
						<li class="mb-1">{@html renderChildren(listItem)}</li>
					{/each}
				</ul>
			{:else}
				<ol class="mb-4 list-decimal pl-5 text-sm text-gray-400">
					{#each node.children as listItem}
						<li class="mb-1">{@html renderChildren(listItem)}</li>
					{/each}
				</ol>
			{/if}
		{/if}
	{/each}
{/if}
