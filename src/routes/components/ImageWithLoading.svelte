<script lang="ts">
    export let src: string;
    export let alt: string = '';
    export let aspectRatio: number = Math.random() * (1.5 - 0.8) + 0.8; // Random aspect ratio between 0.8 and 1.5
    let loaded = false;
    let error = false;

    function handleError() {
        error = true;
        console.error(`Failed to load image: ${src}`);
    }
</script>

<div 
    class="w-full relative bg-gray-100 overflow-hidden"
    style="padding-bottom: {(1 / aspectRatio) * 100}%"
>
    {#if !error}
        <img
            {src}
            {alt}
            class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 {loaded ? 'opacity-100' : 'opacity-0'}"
            on:load={() => loaded = true}
            on:error={handleError}
        />
        {#if !loaded}
            <div class="absolute inset-0 bg-gray-100 animate-pulse"></div>
        {/if}
    {:else}
        <div class="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span class="text-gray-400">Failed to load image</span>
        </div>
    {/if}
</div>
