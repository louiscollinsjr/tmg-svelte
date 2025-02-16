<script lang="ts">
    import { goto } from '$app/navigation';
    import { formatDate } from '../../utils/formatDate';
    import ProjectCard from '../projects/ProjectCard.svelte';

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
    <h1 class="text-[28px] font-semibold text-gray-900 mb-8">Saved Items</h1>

    {#if data?.items}
        {#each Object.entries(data.items) as [type, items]}
            {#if type === 'Project' || type === 'User'}
                <div class="mb-12">
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
                                            <!-- {itemTypes[type]} -->
                                            {#if item.businessInfo?.companyName}
                                                {item.businessInfo.companyName}
                                            {/if}
                                        </p>
                                        <p class="text-[9pt] text-thin font-roboto text-gray-500">Saved {formatDate(item.savedAt)}</p>
                                        <a 
                                            href="#" 
                                            class="text-blue-500 text-xs underline mt-2 inline-block"
                                            on:click|preventDefault={() => removeSavedItem(item.savedItemId)}
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
