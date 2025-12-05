
<script lang="ts">
    import type { ProductCardProps } from "$lib/types";
    import { ArrowUpRight } from '@lucide/svelte';
    import ProductSizeBox from "./ProductSizeBox.svelte";
    import { goto } from '$app/navigation';

let { product }: { product: ProductCardProps } = $props();
let isLongName = $derived(product.productName.length > 15);

const handleNavigate = () => {
    void goto(`/product/${product.productId}`);
};

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNavigate();
    }
};


</script>

<div
    class="w-full bg-white text-black rounded-md flex flex-col mb-4 cursor-pointer"
    role="link"
    tabindex="0"
    onclick={handleNavigate}
    onkeydown={handleKeyDown}
>
    <div class="aspect-square m-1 mx-2 mt-2.5 rounded-lg bg-black overflow-hidden">
        <img src={product.productImages[0]} alt={product.productName} loading="lazy" class="h-full w-full object-cover rounded-lg" />
    </div>

    <div class="h-full bg-gray-100 mb-1 mx-2 grid grid-cols-4 gap-1">
        <div class="col-span-3 my-1 overflow-hidden">
            {#if isLongName}
                <div class="flex whitespace-nowrap animate-marquee">
                    <h2 class="text-lg text-left font-semibold mr-8">{product.productName}</h2>
                    <h2 class="text-lg text-left font-semibold mr-8">{product.productName}</h2>
                    <h2 class="text-lg text-left font-semibold mr-8">{product.productName}</h2>
                    <h2 class="text-lg text-left font-semibold mr-8">{product.productName}</h2>
                </div>
            {:else}
                <h2 class="text-lg text-left font-semibold truncate pl-1">
                    {product.productName}
                </h2>
            {/if}
        </div>
        <div class="col-span-1 flex items-center justify-end pr-2">
            <ArrowUpRight size={28} />
        </div>
        <div class="col-span-2 flex flex-row gap-1 ml-1 items-center mb-1">
            {#if product.availableSizes?.length}
                <ProductSizeBox size={product.availableSizes[0]} />
                
                <!-- Wide View -->
                <div class="hidden md:flex gap-1">
                    {#if product.availableSizes.length > 1}
                        <ProductSizeBox size={product.availableSizes[product.availableSizes.length - 1]} />
                    {/if}
                    {#if product.availableSizes.length > 2}
                        <ProductSizeBox size={`+${product.availableSizes.length - 2}`} />
                    {/if}
                </div>

                <!-- Narrow View -->
                <div class="flex md:hidden gap-1">
                    {#if product.availableSizes.length > 1}
                        <ProductSizeBox size={`+${product.availableSizes.length - 1}`} />
                    {/if}
                </div>
            {/if}
        </div>
        <div class="col-span-2 flex flex-row justify-end mr-2 items-center whitespace-nowrap mb-1">
            <h3 class="text-xl font-bold inline">
                2450
            </h3>
            <span class="text-md m-1  font-bold text-gray-500 ">৳</span>
        </div>
    </div>
</div>