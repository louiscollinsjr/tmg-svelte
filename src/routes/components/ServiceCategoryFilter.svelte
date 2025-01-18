<!-- src/routes/components/ServiceCategoryFilter.svelte -->
<script lang="ts">
    import { Warehouse } from "phosphor-svelte";
    import type { ServiceCategory } from "$lib/types/professional";

    export let categories: ServiceCategory[];
    export let selectedCategory: ServiceCategory | null = null;
    export let onCategorySelect: (category: ServiceCategory | null) => void;
</script>

<div class="flex flex-col space-y-4">
    <h3 class="text-lg font-medium text-gray-900">Categories</h3>
    <div class="flex flex-col space-y-2">
        <button
            class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors"
            class:bg-gray-100={selectedCategory === null}
            class:hover:bg-gray-50={selectedCategory !== null}
            on:click={() => onCategorySelect(null)}
        >
            <div class="flex items-center justify-center w-8 h-8">
                <Warehouse
                    size={35}
                    class={selectedCategory === null ? "text-gray-900" : "text-gray-800"}
                />
            </div>
            <span 
                class="text-sm"
                class:text-gray-900={selectedCategory === null}
                class:text-gray-600={selectedCategory !== null}
            >
                All Categories
            </span>
        </button>
        
        {#each categories as category}
            <button
                class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors"
                class:bg-gray-100={selectedCategory?.id === category.id}
                class:hover:bg-gray-50={selectedCategory?.id !== category.id}
                on:click={() => onCategorySelect(category)}
            >
                <div class="flex items-center justify-center w-8 h-8">
                    <img
                        src={category.icon}
                        alt={category.name}
                        class="w-8 h-8 object-contain"
                        class:opacity-100={selectedCategory?.id === category.id}
                        class:opacity-80={selectedCategory?.id !== category.id}
                    />
                </div>
                <span 
                    class="text-sm"
                    class:text-gray-900={selectedCategory?.id === category.id}
                    class:text-gray-600={selectedCategory?.id !== category.id}
                >
                    {category.name}
                </span>
            </button>
        {/each}
    </div>
</div>