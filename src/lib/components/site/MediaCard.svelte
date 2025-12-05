<script lang="ts">
    import { ShoppingBag, X } from "lucide-svelte";
    import { onMount, tick } from "svelte";

    const VIDEO_EXTENSIONS = [
        "mp4",
        "webm",
        "ogg",
        "ogv",
        "mov",
        "m4v",
        "avi"
    ];

    let { media } = $props<{
        media: {
            mediaURL: string;
            title: string;
            taggedProducts: string[];
        };
    }>();

    const safeMedia = $derived(media ?? { mediaURL: '', title: '', taggedProducts: [] });

    let isHovered = $state(false);
    let isModalOpen = $state(false);
    let videoElement = $state<HTMLVideoElement | undefined>(undefined);
    let dialogRef = $state<HTMLDivElement | null>(null);

    const taggedCount = $derived(safeMedia.taggedProducts?.length ?? 0);
    const sanitizedUrl = $derived(safeMedia.mediaURL?.split("?")[0]?.toLowerCase() ?? "");
    const isVideo = $derived(
        sanitizedUrl.startsWith("data:video") ||
        VIDEO_EXTENSIONS.some((ext) => sanitizedUrl.endsWith(`.${ext}`))
    );
    const altText = $derived(safeMedia.title || "Featured media");

    onMount(() => {
        ensureAutoplay();

        return () => {
            videoElement?.pause();
        };
    });

    async function ensureAutoplay() {
        if (!videoElement || !isVideo) return;
        videoElement.loop = true;
        videoElement.controls = false;
        videoElement.muted = true;

        await tick();
        await videoElement.play().catch(() => {
            // Gracefully ignore play promise rejections (e.g., autoplay policies)
        });
    }

    function handleMouseEnter() {
        isHovered = true;

        if (!videoElement || !isVideo) return;

        videoElement.pause();
    }

    function handleMouseLeave() {
        isHovered = false;

        if (!videoElement || !isVideo) return;

        void videoElement.play().catch(() => {
            // Ignore failures (e.g., user gesture required)
        });
    }

    async function openModal() {
        handleMouseLeave();
        isModalOpen = true;

        await tick();
        dialogRef?.focus();
        ensureAutoplay();
    }

    function closeModal() {
        isModalOpen = false;
    }

    function handleModalKeydown(event: KeyboardEvent) {
        if (!isModalOpen) return;

        if (event.key === "Escape") {
            event.preventDefault();
            closeModal();
        }
    }
</script>

<svelte:window onkeydown={handleModalKeydown} />

<button
    type="button"
    class="w-full bg-white text-black rounded-md flex flex-col cursor-pointer shadow transition-shadow duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black mb-4"
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    onfocus={handleMouseEnter}
    onblur={handleMouseLeave}
    onclick={openModal}
>
    <div class="p-2 text-left">
        <div class="relative overflow-hidden rounded-md bg-black">
            {#if isVideo}
                <video
                    class="block w-full h-auto"
                    src={safeMedia.mediaURL}
                    bind:this={videoElement}
                    autoplay
                    playsinline
                    muted
                    aria-hidden="true"
                    onloadeddata={ensureAutoplay}
                ></video>
            {:else}
                <img
                    class="block w-full h-auto"
                    src={safeMedia.mediaURL}
                    alt={altText}
                    loading="lazy"
                />
            {/if}

            <div
                class={`pointer-events-none absolute inset-0 flex items-end px-3 pb-3 text-white text-sm font-medium transition-opacity duration-200 ${
                    isHovered ? "opacity-100" : "opacity-0"
                }`}
                style="background: linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.75) 100%);"
            >
                <div class="flex items-center gap-2">
                    <ShoppingBag class="h-4 w-4" />
                    <span>{taggedCount} {taggedCount === 1 ? "Product" : "Products"} Tagged</span>
                </div>
            </div>
        </div>
    </div>
</button>

{#if isModalOpen}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
        <div class="absolute inset-0 bg-black/80" aria-hidden="true"></div>
        <button
            type="button"
            class="absolute inset-0 w-full h-full cursor-pointer"
            aria-label="Close preview"
            onclick={closeModal}
        ></button>
        <div
            class="relative z-10 w-full max-w-[80vw] max-h-[80vh] bg-white text-black rounded-lg shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black overflow-hidden flex flex-col"
            tabindex="-1"
            bind:this={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${safeMedia.title} preview`}
        >
            <button
                type="button"
                class="absolute top-3 right-3 p-2 rounded-full bg-black/10 text-black hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                aria-label="Close preview"
                onclick={closeModal}
            >
                <X class="h-4 w-4" />
            </button>

            <div class="flex-1 overflow-hidden">
                <div class="grid h-full gap-6 p-6 md:grid-cols-[2fr_1fr]">
                    <div class="w-full min-h-0">
                        <div class="flex h-full w-full items-center justify-center overflow-hidden rounded-md bg-black">
                            {#if isVideo}
                                <video
                                    class="h-full w-full object-contain"
                                    src={safeMedia.mediaURL}
                                    controls
                                    loop
                                    playsinline
                                    muted
                                ></video>
                            {:else}
                                <img
                                    class="h-full w-full object-contain"
                                    src={safeMedia.mediaURL}
                                    alt={altText}
                                    loading="lazy"
                                />
                            {/if}
                        </div>
                    </div>

                    <div class="flex flex-col min-h-0 space-y-4">
                        <h2 class="text-xl font-semibold">{safeMedia.title}</h2>
                        <p class="text-sm text-gray-600">Tagged products</p>

                        {#if taggedCount > 0}
                            <div class="flex-1 overflow-y-auto pr-2">
                                <ul class="grid grid-cols-2 gap-2">
                                    {#each safeMedia.taggedProducts as productId (productId)}
                                        <li class="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-800">
                                            {productId}
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        {:else}
                            <p class="text-sm text-gray-500">No products tagged for this media.</p>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
