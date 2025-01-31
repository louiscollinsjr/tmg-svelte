<!-- src/routes/components/ProjectList.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import { CaretDown } from 'phosphor-svelte';

    export let projects: Array<{
        _id: string;
        title: string;
        description: string;
        status: string;
        budget: number;
        city: string;
        state: string;
        zipcode: string;
        client: {
            _id: string;
            name: string;
            email: string;
        };
        contractor: string;
        images: Array<{ url: string; caption: string; _id: string }>;
        createdAt: string;
        updatedAt: string;
    }>;

    let expandedProjectId: string | null = null;

    function toggleProject(projectId: string) {
        expandedProjectId = expandedProjectId === projectId ? null : projectId;
    }

    function formatCurrency(amount: number) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
</script>

<section class="space-y-4 max-w-5xl mx-auto">
    {#each projects as project (project._id)}
        <div class="bg-gray-50 rounded-sm border-b border-gray-200 overflow-hidden pb-8">
            <!-- Project Header - Always visible -->
            <div
                class="p-0cursor-pointer hover:bg-gray-50 transition-colors"
                on:click={() => toggleProject(project._id)}
            >
                <div class="flex items-center justify-between px-8">
                    <div class="flex-1 max-w-xl">
                        <h3 class="text-lg font-medium text-gray-900">{project.title}</h3>
                        <p class="mt-1 text-sm text-gray-500 line-clamp-2">{project.description}</p>
                    </div>
                    <div class="ml-4 flex items-center space-x-4">
                        <div class="text-right">
                            <p class="text-sm font-medium text-gray-900">{formatCurrency(project.budget)}</p>
                            <p class="text-sm text-gray-500">{project.city}, {project.state}</p>
                        </div>
                        <span class:rotate-180={expandedProjectId === project._id} class="transform transition-transform duration-200">
                            <CaretDown
                                size={20}
                                class="text-gray-400"
                            />
                        </span>
                    </div>
                </div>
            </div>

            <!-- Expanded Content -->
            {#if expandedProjectId === project._id}
                <div class="border-t border-gray-100 px-8 pt-4 mt-4 bg-gray-50">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Project Details -->
                        <div>
                            <h4 class="font-medium text-gray-900 mb-2">Project Details</h4>
                            <dl class="space-y-2">
                                <div>
                                    <dt class="text-sm text-gray-500">Location</dt>
                                    <dd class="text-sm text-gray-900">{project.city}, {project.state} {project.zipcode}</dd>
                                </div>
                                <div>
                                    <dt class="text-sm text-gray-500">Posted</dt>
                                    <dd class="text-sm text-gray-900">{formatDate(project.createdAt)}</dd>
                                </div>
                                {#if project.client?.name}
                                    <div>
                                        <dt class="text-sm text-gray-500">Client</dt>
                                        <dd class="text-sm text-gray-900">{project.client.name}</dd>
                                    </div>
                                {/if}
                            </dl>
                        </div>

                        <!-- Project Images -->
                        {#if project.images && project.images.length > 0}
                            <div>
                                <h4 class="font-medium text-gray-900 mb-2">Project Images</h4>
                                <div class="grid grid-cols-2 gap-2">
                                    {#each project.images.slice(0, 4) as image}
                                        <img
                                            src={image.url}
                                            alt={image.caption || 'Project image'}
                                            class="h-32 w-full object-cover rounded-lg"
                                        />
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>

                    <!-- Action Buttons -->
                    <div class="mt-4 flex space-x-4">
                        <form
                            method="POST"
                            action="?/acceptProject"
                            use:enhance={() => {
                                return async ({ result }) => {
                                    if (result.type === 'success') {
                                        expandedProjectId = null;
                                    }
                                };
                            }}
                        >
                            <input type="hidden" name="projectId" value={project._id} />
                            <button
                                type="submit"
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                Accept Job
                            </button>
                        </form>
                        {#if project.client?.email}
                            <a
                                href="mailto:{project.client.email}?subject=Regarding%20Project:%20{encodeURIComponent(project.title)}"
                                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                Contact Client
                            </a>
                        {:else}
                            <button
                                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                disabled
                            >
                                Contact Client
                            </button>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    {/each}
    </section>
