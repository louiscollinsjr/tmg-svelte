<!-- src/routes/components/ProfessionalsGrid.svelte -->
<script lang="ts">
    import type { Professional } from "$lib/types/professional";
    import { Star } from "phosphor-svelte";

    export let professionals: Professional[];
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each professionals as professional}
        <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div class="aspect-w-16 aspect-h-9 relative">
                <img
                    src={professional.coverImage}
                    alt={professional.name}
                    class="object-cover w-full h-full"
                />
            </div>
            <div class="p-6">
                <div class="flex items-start justify-between">
                    <div>
                        <h3 class="text-lg font-medium text-gray-900 mb-1">
                            {professional.name}
                        </h3>
                        <p class="text-sm text-gray-600 mb-2">
                            {professional.category.name}
                        </p>
                    </div>
                    <div class="flex items-center">
                        <Star weight="fill" class="w-4 h-4 text-yellow-400 mr-1" />
                        <span class="text-sm font-medium text-gray-900">
                            {professional.rating.toFixed(1)}
                        </span>
                    </div>
                </div>
                <p class="text-sm text-gray-600 line-clamp-2 mb-4">
                    {professional.description}
                </p>
                <div class="flex items-center justify-between">
                    <div class="flex -space-x-2">
                        {#each professional.recentProjects.slice(0, 3) as project}
                            <img
                                src={project.image}
                                alt=""
                                class="w-8 h-8 rounded-full border-2 border-white object-cover"
                            />
                        {/each}
                        {#if professional.recentProjects.length > 3}
                            <div class="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                                <span class="text-xs text-gray-600 font-medium">
                                    +{professional.recentProjects.length - 3}
                                </span>
                            </div>
                        {/if}
                    </div>
                    <a
                        href={`/professionals/${professional.id}`}
                        class="text-sm font-medium text-orange-500 hover:text-orange-600"
                    >
                        View Profile →
                    </a>
                </div>
            </div>
        </div>
    {/each}
</div>