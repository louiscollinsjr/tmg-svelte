<!-- Project details page -->
<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { fade } from 'svelte/transition';

    export let data;

    $: project = data.project;
    $: reviews = data.reviews;

    function formatDate(date: string) {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function handleBack() {
        history.back();
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-64">
    <!-- Back button and header -->
    <div class="mb-8">
        <button
            on:click={handleBack}
            class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to projects
        </button>
        <h1 class="text-2xl font-semibold text-gray-900">{project.title}</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main content -->
        <div class="lg:col-span-2">
            <!-- Project images -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                <div class="aspect-w-16 aspect-h-9">
                    <img 
                        src={project.thumbnail || '/default-project.png'} 
                        alt={project.title}
                        class="object-cover"
                    />
                </div>
            </div>

            <!-- Project details -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden p-6 mb-8">
                <h2 class="text-lg font-medium text-gray-900 mb-4">Project Details</h2>
                <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Status</dt>
                        <dd class="mt-1 text-sm text-gray-900">{project.status}</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Start Date</dt>
                        <dd class="mt-1 text-sm text-gray-900">{formatDate(project.startDate)}</dd>
                    </div>
                    {#if project.completionDate}
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Completion Date</dt>
                            <dd class="mt-1 text-sm text-gray-900">{formatDate(project.completionDate)}</dd>
                        </div>
                    {/if}
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Budget</dt>
                        <dd class="mt-1 text-sm text-gray-900">${project.budget}</dd>
                    </div>
                </dl>
            </div>

            <!-- Project description -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden p-6 mb-8">
                <h2 class="text-lg font-medium text-gray-900 mb-4">Description</h2>
                <div class="prose prose-sm max-w-none text-gray-500">
                    {project.description}
                </div>
            </div>

            <!-- Reviews section -->
            {#if reviews.length > 0}
                <div class="bg-white rounded-lg shadow-sm overflow-hidden p-6">
                    <h2 class="text-lg font-medium text-gray-900 mb-4">Reviews</h2>
                    <div class="space-y-6">
                        {#each reviews as review}
                            <div class="flex space-x-4">
                                <div class="flex-shrink-0">
                                    <img 
                                        class="h-10 w-10 rounded-full"
                                        src={review.reviewer?.image || '/default-avatar.png'}
                                        alt={review.reviewer?.name || 'Reviewer'}
                                    />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center mb-1">
                                        <p class="text-sm font-medium text-gray-900 mr-2">{review.reviewer?.name || 'Reviewer'}</p>
                                        <p class="text-sm text-gray-500">{formatDate(review.date)}</p>
                                    </div>
                                    <div class="flex items-center mb-2">
                                        {#each Array(5) as _, i}
                                            <svg 
                                                class="h-5 w-5 {i < review.rating ? 'text-yellow-400' : 'text-gray-300'}"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                            </svg>
                                        {/each}
                                    </div>
                                    <p class="text-sm text-gray-600">{review.comment}</p>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
            <!-- Client information -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden p-6 mb-8">
                <h2 class="text-lg font-medium text-gray-900 mb-4">Client</h2>
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <img 
                            class="h-12 w-12 rounded-full"
                            src={project.client?.image || '/default-image.png'}
                            alt={project.client?.name || 'Client'}
                        />
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">{project.client?.name || 'Client'}</p>
                        <p class="text-sm text-gray-500">{project.client?.email || 'No email provided'}</p>
                    </div>
                </div>
            </div>

            <!-- Project timeline -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden p-6">
                <h2 class="text-lg font-medium text-gray-900 mb-4">Timeline</h2>
                <div class="flow-root">
                    <ul class="-mb-8">
                        {#each project.timeline || [] as event, index}
                            <li>
                                <div class="relative pb-8">
                                    {#if index !== project.timeline.length - 1}
                                        <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                    {/if}
                                    <div class="relative flex space-x-3">
                                        <div>
                                            <span class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                                <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                            </span>
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <div>
                                                <p class="text-sm text-gray-500">{formatDate(event.date)}</p>
                                            </div>
                                            <div class="mt-1">
                                                <p class="text-sm text-gray-900">{event.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
