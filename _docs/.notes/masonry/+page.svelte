
<script lang="ts">
    import { Masonry } from 'svelte-bricks';
    import ProductCard from "$lib/components/site/ProductCard.svelte";
    import MediaCard from "$lib/components/site/MediaCard.svelte";
    import type { PageData } from "./$types";
    import type { MasonryItem } from "$lib/types";

    let { data }: { data: PageData } = $props();
    let items = $derived(data?.items ?? []);

    // Custom column calculation to enforce:
    // - 2 columns on mobile/small tablets (< 768px)
    // - Max 5 columns on desktop
    function calcCols(masonryWidth: number, minColWidth: number, gap: number): number {
        // Force 2 columns for viewports < 768px
        if (masonryWidth < 768) {
            return 2;
        }
        
        // Calculate columns based on available width
        const defaultCols = Math.floor((masonryWidth + gap) / (minColWidth + gap)) || 1;
        
        // Cap at 5 columns maximum
        return Math.min(5, defaultCols);
    }
</script>

<Masonry 
    {items} 
    idKey="id"
    minColWidth={164}
    maxColWidth={364}
    gap={16}
    {calcCols}
    class="px-4 py-8"
>
    {#snippet children({ item }: { item: MasonryItem })}
        {#if item.type === 'product'}
            <ProductCard product={item.product} />
        {:else if item.type === 'media'}
            <MediaCard media={item.media} />
        {/if}
    {/snippet}
</Masonry>