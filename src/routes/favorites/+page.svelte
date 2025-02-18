<script lang="ts">
    import { goto } from '$app/navigation';
    import { formatDate } from '../../utils/formatDate';
    import ProjectCard from '../projects/ProjectCard.svelte';
    import { Star } from 'phosphor-svelte';

    export let data;

    console.log('Saved Items Data:', data);

    const itemTypes = {
        'Project': 'Projects',
        'User': 'Users'
    };

    function viewItem(type: string, id: string) {
        const routes = {
            'Project': `/projects/${id}`,
            'User': `/profile/${id}`
        };
        goto(routes[type]);
    }

    async function removeSavedItem(savedItemId: string) {
        try {
            const response = await fetch(`/api/saved-items/${savedItemId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to remove item');
            }

            // Refresh the page to update the list
            window.location.reload();
        } catch (error) {
            console.error('Error removing saved item:', error);
        }
    }
</script>

<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-64">
    <h1 class="text-[28px] font-semibold text-gray-900 mb-8">Favorites</h1>

    {#if data?.items}
        {#each Object.entries(data.items) as [type, items]}
            {#if type === 'Project' || type === 'User'}
                <div class="mb-12 border-b border-gray-200 pb-16">
                    <h2 class="text-lg font-medium text-gray-900 mb-6">{itemTypes[type] || type}</h2>
                    <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                        {#each items as item}
                            {#if type === 'Project'}
                                <ProjectCard 
                                    project={item} 
                                    viewProject={() => viewItem(type, item._id)} 
                                    dateField="updatedAt"
                                    ctaText="Remove from Saved"
                                    ctaUrl="#"
                                    onCtaClick={() => removeSavedItem(item.savedItemId)}
                                />
                            {:else if type === 'User'}
                                <button
                                    class="flex items-start overflow-hidden rounded-lg"
                                    on:click={() => viewItem(type, item._id)}
                                >
                                    <img
                                        class="h-24 w-24 object-cover rounded-xl"
                                        src={item.image || '/default-image.png'}
                                        alt={item.name}
                                    />
                                    <div class="pt-2 pl-4 text-left">
                                        <h3 class="text-xs font-medium text-gray-900 tracking-wide">{item.name}</h3>
                                        <p class="text-[9pt] text-thin font-roboto text-gray-500">
                                            {#if item.businessInfo?.companyName}
                                                {item.businessInfo.companyName}
                                            {/if}
                                        </p>
                                        {#if item.rating !== undefined}
                                            <div class="flex items-center gap-1 mt-1">
                                                <div class="flex">
                                                    {#each Array(5) as _, i}
                                                        {#if item.rating >= i + 1}
                                                            <svg
                                                                class="h-3 w-3 text-gray-600"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                                                />
                                                            </svg>
                                                        {:else}
                                                            <svg
                                                                class="h-3 w-3 text-gray-300"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                                                />
                                                            </svg>
                                                        {/if}
                                                    {/each}
                                                </div>
                                                <span class="text-[9pt] text-thin font-roboto text-gray-500">
                                                    {item.rating} ({item.reviewCount} {item.reviewCount === 1 ? 'review' : 'reviews'})
                                                </span>
                                            </div>
                                        {/if}
                                        <!-- <p class="text-[9pt] text-thin font-roboto text-gray-500">Saved {formatDate(item.savedAt)}</p> -->
                                        <a 
                                            href="#" 
                                            class="text-blue-500 text-xs underline mt-2 inline-block"
                                            on:click|preventDefault|stopPropagation={() => removeSavedItem(item.savedItemId)}
                                        >
                                            Remove from Saved
                                        </a>
                                    </div>
                                </button>
                            {/if}
                        {/each}
                    </div>
                </div>
            {/if}
        {/each}

        {#if Object.keys(data.items).length === 0}
            <div class="text-center py-12">
                <p class="text-gray-500">You haven't saved any items yet.</p>
            </div>
        {/if}
    {:else}
        <div class="text-center py-12">
            <p class="text-gray-500">Loading...</p>
        </div>
    {/if}
</div>
