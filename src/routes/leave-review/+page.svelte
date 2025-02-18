<!-- src/routes/leave-review/+page.svelte -->
<script lang="ts">
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';
    import { ArrowLeft, Star, Camera } from 'phosphor-svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    export let data: PageData;
    let form: HTMLFormElement;
    
    let rating = 0;
    let images: FileList;
    let imagePreviewUrls: string[] = [];
    let error: string | null = null;
    let isSubmitting = false;

    function handleImageChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            images = input.files;
            imagePreviewUrls = [];
            
            for (let i = 0; i < images.length; i++) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreviewUrls = [...imagePreviewUrls, e.target?.result as string];
                };
                reader.readAsDataURL(images[i]);
            }
        }
    }

    function setRating(value: number) {
        rating = value;
        error = null;
    }

    function handleSubmit() {
        if (rating === 0) {
            error = 'Please select a rating';
            return false;
        }
        isSubmitting = true;
        return true;
    }

    function handleError(e: Error) {
        isSubmitting = false;
        error = e.message;
    }
</script>

<main class="bg-white min-h-screen">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="border-0 border-gray-200 pb-4 pt-6">
            <div class="flex items-center justify-between">
                <button class="p-3 rounded-full bg-gray-100 hover:bg-gray-200" on:click={() => history.back()}>
                    <ArrowLeft class="h-4 w-4 text-gray-600" />
                </button>
                <h1 class="text-xl font-semibold text-gray-900">Leave a Review</h1>
                <div class="w-10"></div> <!-- Spacer for alignment -->
            </div>
        </div>

        <!-- Project Info -->
        <div class="py-6 border-b border-gray-200">
           
            {#if data.project.contractor}
                 <div class="p-4 border-0 bg-white flex flex-col items-center">
                <div class="flex items-center gap-1 flex-col">
                    <img
                        src={data.project.contractor.avatar || '/default-avatar.png'}
                        alt={data.project.contractor.name}
                        class="w-8 h-8 rounded-full object-cover"
                    />
                    <h2 class="font-semibold text-xs">Work by: {data.project.contractor.name}</h2>
                    <h2 class="text-lg font-medium text-gray-900">{data.project.title} </h2>
                    <p class="text-gray-300 text-xs">{data.project._id}</p>
                </div>
            </div>
            {/if}
        </div>

        {#if error}
            <div class="mt-4 p-4 bg-red-50 rounded-md">
                <p class="text-sm text-red-700">{error}</p>
            </div>
        {/if}

        <!-- Review Form -->
        <form 
            bind:this={form}
            method="POST" 
            use:enhance={() => {
                return async ({ result, update }) => {
                    isSubmitting = false;
                    if (result.type === 'success') {
                        await update();
                        goto('/projects');
                    } else if (result.type === 'failure') {
                        error = result.data?.error || 'Failed to submit review';
                    }
                };
            }}
            on:submit|preventDefault={() => handleSubmit()}
            enctype="multipart/form-data"
            class="py-6 space-y-6"
        >
            <input type="hidden" name="projectId" value={data.project._id} />
            <input type="hidden" name="rating" value={rating} />
            
            <!-- Rating -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
                <div class="flex gap-2">
                    {#each Array(5) as _, i}
                        <button 
                            type="button"
                            class="p-2 rounded-full hover:bg-gray-100"
                            on:click={() => setRating(i + 1)}
                        >
                            <Star 
                                weight={rating > i ? "fill" : "regular"}
                                class="h-6 w-6 {rating > i ? 'text-orange-500' : 'text-gray-300'}"
                            />
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Title -->
            <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Add a headline</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    class="placeholder:pl-2 block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                    placeholder="What's most important to know?"
                />
            </div>

            <!-- Content -->
            <div>
                <label for="content" class="block text-sm font-medium text-gray-700 mb-2">Add a written review</label>
                <textarea
                    name="content"
                    id="content"
                    required
                    rows="4"
                    class="placeholder:pl-2 block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                    placeholder="What did you like or dislike? How was the service? "
                ></textarea>
            </div>

            <!-- Image Upload -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Add Photos</label>
                <div class="mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-900/25 px-6 py-10">
                    <div class="text-center">
                        <Camera class="mx-auto h-12 w-12 text-gray-400" />
                        <div class="mt-4 flex text-sm leading-6 text-gray-600">
                            <label for="images" class="relative cursor-pointer rounded-md bg-white font-semibold text-orange-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-600 focus-within:ring-offset-2 hover:text-orange-500">
                                <span>Upload files</span>
                                <input 
                                    id="images" 
                                    name="images" 
                                    type="file" 
                                    class="sr-only" 
                                    multiple 
                                    accept="image/*"
                                    on:change={handleImageChange}
                                />
                            </label>
                            <p class="pl-1">or drag and drop</p>
                        </div>
                        <p class="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                </div>
                {#if imagePreviewUrls.length > 0}
                    <div class="mt-4 grid grid-cols-3 gap-4">
                        {#each imagePreviewUrls as url}
                            <img src={url} alt="Preview" class="rounded-lg object-cover h-24 w-full" />
                        {/each}
                    </div>
                {/if}
            </div>
            
            <p class="text-xs text-gray-500 border-t border-gray-200 pt-4 pb-12">We will notify you va email as soon as your review is processed.</p>

            <button
                type="submit"
                disabled={isSubmitting}
                class=" rounded-lg bg-orange-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    </div>
</main>
