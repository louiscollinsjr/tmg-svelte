<!-- src/routes/profile/[id]/+page.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    import {Star, ShareFat, Heart} from "phosphor-svelte";
    $: data = $page.data;
    //$: console.log('Professional Profile Data:', data);
    $: isOwnProfile = data.session?.user && data.professional._id === data.session.user.id;
    $: isSaved = data.isSaved;

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    async function handleSave() {
        if (!data.session?.user) {
            // Handle not logged in state - maybe redirect to login
            return;
        }

        const form = new FormData();
        form.append('professionalId', data.professional._id);

        const response = await fetch('?/toggleSave', {
            method: 'POST',
            body: form
        });

        const result = await response.json();
        if (result.success) {
            isSaved = result.isSaved;
        }
    }
</script>

<div class="profile-container">
    {#if data.professional}
        <section class="profile-header pt-64 w-full">
            <div class="w-full px-4 sm:px-6 py-6">
                <div class="flex items-start justify-between w-full">
                    <div class="flex items-start gap-6 flex-grow">
                        <img src={data.professional.image} alt="Profile" class="w-20 h-20 rounded-xl object-cover" />
                        <div class="flex-grow">
                            <h1 class="text-4xl text-gray-900 font-roboto tracking-wide font-semibold">
                                {data.professional.name}
                            </h1>
                            {#if data.professional.businessInfo?.companyName}
                                <span class="text-sm text-gray-600 mt-0 font-roboto font-normal">
                                    {data.professional.businessInfo.companyName}
                                </span>
                                {#if data.professional.contact?.address?.city && data.professional.contact?.address?.state}
                                    <span class="text-gray-400"> • </span>
                                    <span class="text-xs text-gray-600">
                                        {data.professional.contact.address.city}, {data.professional.contact.address.state}
                                    </span>
                                {/if}
                                <div class="flex items-center gap-2 mt-1">
                                    <div class="flex">
                                        {#each Array(5) as _, i}
                                            <svg class={`w-4 h-4 ${i < (data.professional.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                                 fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                            </svg>
                                        {/each}
                                    </div>
                                    <span class="text-gray-600 text-xs">
                                        {(data.professional.rating || 0).toFixed(1)}
                                    </span>
                                </div>
                                <!-- {#if data.professional.businessInfo?.yearsInBusiness}
                                    <p class="text-sm text-gray-500 mt-1">{data.professional.businessInfo.yearsInBusiness} years in business</p>
                                {/if} -->
                            {/if}
                        </div>
                    </div>
                    <div class="flex flex-col gap-4 ml-4">
                        <button class="bg-[#f05005] bg-black text-white font-roboto text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                            Send a message
                        </button>
                        <div class="flex gap-2">
                            <button class="text-gray-900 text-xs px-4 py-2 rounded-sm border border-gray-100 bg-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-2">
                               <Star class="w-3 h-3 text-gray-900" /> <p class="inline-block ml-1 underline">Write a review</p>
                            </button>
                            <button class="text-gray-900 text-xs px-4 py-2 rounded-sm border border-gray-100 bg-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-2">
                                <ShareFat class="w-3 h-3 text-gray-900" /> <p class="inline-block ml-1 underline">Share</p>
                            </button>
                            <button 
                                class="text-gray-900 text-xs px-4 py-2 rounded-sm border border-gray-100 bg-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                on:click={handleSave}
                            >
                                <Heart class="w-3 h-3 text-gray-900" weight={isSaved ? "fill" : "regular"} /> 
                                <p class="inline-block ml-1 underline">{isSaved ? 'Saved' : 'Save'}</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="business-info mt-8">
            <h2 class="text-xl font-semibold mb-4">Business Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#if data.professional.businessInfo?.specialties?.length}
                    <div class="info-item">
                        <h3 class="text-gray-600 font-medium">Specialties</h3>
                        <ul class="mt-2 space-y-1">
                            {#each data.professional.businessInfo.specialties as specialty}
                                <li class="text-gray-800">{specialty}</li>
                            {/each}
                        </ul>
                    </div>
                {/if}

                {#if data.professional.businessInfo?.serviceArea?.length}
                    <div class="info-item">
                        <h3 class="text-gray-900 font-medium">Service Areas</h3>
                        <ul class="mt-2 space-y-1">
                            {#each data.professional.businessInfo.serviceArea as area}
                                <li class="text-gray-800">{area}</li>
                            {/each}
                        </ul>
                    </div>
                {/if}

                {#if data.professional.businessInfo?.license}
                    <div class="info-item">
                        <h3 class="text-gray-900 font-medium">License</h3>
                        <p class="text-gray-800 mt-2">{data.professional.businessInfo.license}</p>
                    </div>
                {/if}

                {#if data.professional.businessInfo?.insurance}
                    <div class="info-item">
                        <h3 class="text-gray-900 font-medium">Insurance</h3>
                        <p class="text-gray-800 mt-2">{data.professional.businessInfo.insurance}</p>
                    </div>
                {/if}
            </div>
        </section>

        {#if data.reviews?.length}
            <section class="reviews mt-8">
                <h2 class="text-xl font-semibold mb-4">Reviews</h2>
                <div class="space-y-6">
                    {#each data.reviews as review}
                        <div class="review-card bg-white p-6 rounded-lg shadow-sm">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <h3 class="font-medium">{review.title}</h3>
                                    <div class="flex items-center mt-1">
                                        <div class="flex">
                                            {#each Array(5) as _, i}
                                                <svg class={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                </svg>
                                            {/each}
                                        </div>
                                        <span class="text-sm text-gray-500 ml-2">{formatDate(review.createdAt)}</span>
                                    </div>
                                </div>
                                {#if review.helpful?.count > 0}
                                    <div class="text-sm text-gray-500">
                                        {review.helpful.count} found this helpful
                                    </div>
                                {/if}
                            </div>
                            <p class="text-gray-600">{review.content}</p>
                            {#if review.images?.length}
                                <div class="mt-4 grid grid-cols-2 gap-2">
                                    {#each review.images as image}
                                        <img src={image.url} alt={image.caption || ''} class="rounded-lg object-cover w-full h-32" />
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </section>
        {/if}

        {#if data.projects?.length}
            <section class="projects mt-8">
                <h2 class="text-xl font-semibold mb-4">Recent Projects</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {#each data.projects as project}
                        <div class="project-card bg-white rounded-lg shadow-sm overflow-hidden">
                            {#if project.images?.[0]}
                                <img src={project.images[0].url} alt={project.images[0].caption || ''} class="w-full h-48 object-cover" />
                            {/if}
                            <div class="p-4">
                                <p class="text-sm text-gray-500">{formatDate(project.metadata?.completionDate || project.createdAt)}</p>
                                {#if project.metadata?.categories?.length}
                                    <div class="mt-2 flex flex-wrap gap-2">
                                        {#each project.metadata.categories as category}
                                            <span class="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{category}</span>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </section>
        {/if}
    {:else}
        <p class="text-center text-gray-500 py-8">Professional not found.</p>
    {/if}
</div>

<style>
    .profile-container {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 0 1rem;
    }

    .profile-header {
        display: flex;
        align-items: center;
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .info-item {
        background: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
</style>
