<!-- src/routes/components/ProfessionalsGrid.svelte -->
<script lang="ts">
	import type { Professional } from '$lib/types/professional';
	import { Star, Heart } from 'phosphor-svelte';
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores';
	import { get } from 'svelte/store';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';

	export let data: PageData;
	export let professionals: Professional[] = data?.professionals || [];
	export let selectedCategory: string | null = data?.selectedCategory || null;

	let session;

	let savedItems = data.savedItems || [];

	async function handleSave(e: Event, professionalId: string) {
		e.preventDefault();
		e.stopPropagation();

		if (!data?.userData?._id) {
			// Handle not logged in state
			return;
		}

		try {
			const response = await fetch('/api/saved-items', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userId: data.userData._id,
					itemId: professionalId,
					itemType: 'User'
				})
			});

			if (!response.ok) {
				throw new Error('Failed to save professional');
			}

			const result = await response.json();
			console.log('Save result:', result);

			// Update the savedItems array
			if (savedItems.includes(professionalId)) {
				savedItems = savedItems.filter((id) => id !== professionalId);
			} else {
				savedItems = [...savedItems, professionalId];
			}

			// Refresh the page data to update the UI
			await invalidateAll();
		} catch (error) {
			console.error('Error saving professional:', error);
		}
	}

	function isProfessionalSaved(id: string) {
		return savedItems.includes(id);
	}

    async function requestEstimate(professionalId: string) {
        const userId = data.userData?._id;

        // Check URL for projectId
        const urlParams = new URLSearchParams(window.location.search);
        let projectId = urlParams.get('projectId');

        if (!projectId) {
            // Fallback to last project created with null contractor
            const activeProject = data.pendingProjects?.find(project => project.contractor === null);
            projectId = activeProject?._id;
        }

        console.log('Requesting estimate with userId:', userId, 'professionalId:', professionalId, 'projectId:', projectId);

        if (!userId) {
            console.error('User is not logged in');
            return;
        }

        try {
            const response = await fetch('/api/conversations/estimate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tradespersonId: professionalId,
                    userId: userId, // Pass userId
                    projectId: projectId // Pass projectId if available
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create conversation');
            }

            const result = await response.json();
            // Redirect to messages with the new conversation
            goto(`/messages?conversation=${result.conversationId}`);
        } catch (error) {
            console.error('Error requesting estimate:', error);
            // TODO: Show error notification
        }
    }

	onMount(async () => {
		session = get(auth);
	});

	function getJoinedYear(professional: Professional) {
		if (professional.createdAt?.$date) {
			return new Date(professional.createdAt.$date).getFullYear();
		}
		return 'Recently';
	}

	console.log('ProfessionalsGrid - data:', data);

	$: professionals = professionals.map(prof => ({
		...prof,
		isSaved: isProfessionalSaved(prof._id?.$oid || prof._id as string)
	}));
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
	{#each professionals as professional (professional._id?.$oid || professional._id)}
		<div
			class="relative h-full rounded-lg bg-gray-100 p-4 py-3 pb-16 pr-3 transition-colors hover:bg-gray-50"
		>
			<a href={`/profile/${professional._id}`} class="relative block">
				<div class="mb-3 flex items-center">
					<div class="relative h-16 w-16 flex-shrink-0">
						{#if professional.image}
							<img
								src={professional.image}
								alt={professional.name}
								class="absolute inset-0 h-full w-full rounded-lg border-2 border-white object-cover shadow-lg"
							/>
						{:else}
							<div
								class="absolute inset-0 flex h-full w-full items-center justify-center rounded-lg bg-orange-500 font-medium text-white shadow-sm"
							>
								{professional.name
									.split(' ')
									.map((word) => word[0])
									.slice(0, 2)
									.join('')
									.toUpperCase()}
							</div>
						{/if}
					</div>
					<div class="ml-3 min-w-0">
						<h3 class="truncate font-roboto text-sm font-medium tracking-wide text-gray-900">
							{professional.name}
						</h3>
						{#if professional.businessInfo?.companyName}
							<p class="mt-0 truncate font-roboto text-xs text-gray-500">
								{professional.businessInfo.companyName}
							</p>
						{/if}
						<p class="mt-0 font-roboto text-xs text-gray-500">
							Joined {getJoinedYear(professional)}
						</p>
					</div>
				</div>

				<div class="mt-1 flex items-center gap-1">
					<Star class="h-3 w-3 text-gray-900" weight="fill" />
					<span class="text-xs text-gray-900">{professional.rating?.toFixed(1) || '0.0'}</span>
					<span class="ml-1 text-xs text-gray-500"
						>• {professional.reviewCount || 0}
						{professional.reviewCount == 1 ? 'Review' : 'Reviews'}</span
					>
					{#if professional.isFavorite}
						<span class="ml-2 rounded bg-gray-900 px-1.5 py-0.5 text-[10px] font-medium text-white">
							<b>tmg.</b> Choice
						</span>
					{/if}
				</div>

				<!-- <p class="text-xs text-gray-600 mt-1 truncate">
            {professional.businessInfo?.specialties?.join(', ') || 'Various Services'}
          </p> -->

				{#if professional.projectImages && professional.projectImages.length > 0}
					<div class="relative mt-4 aspect-square w-full">
						<img
							src={professional.projectImages[0].url}
							alt={professional.projectImages[0].caption || 'Project preview'}
							class="absolute inset-0 h-full w-full rounded-xl object-cover"
						/>
					</div>
				{:else}
					<div class="relative mt-4 aspect-square w-full">
						<div class="flex h-full w-full items-center justify-center rounded-xl bg-gray-200">
							<p class="text-sm text-gray-300">No project images</p>
						</div>
					</div>
				{/if}
		</a>
			
				<button
                    class="absolute bottom-3 left-3 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 px-6 py-2 font-roboto text-xs font-normal text-white transition-colors hover:bg-orange-500"
                    on:click={() => requestEstimate(professional._id?.$oid || professional._id)}
                >
                    Request Estimate
                </button>
				<button
					class="absolute bottom-3 right-3 rounded-full p-2 transition-colors hover:bg-gray-100"
					on:click={(e) => handleSave(e, professional._id?.$oid || professional._id as string)}
				>
					{#if isProfessionalSaved(professional._id?.$oid || professional._id as string)}
						<Heart weight="fill" class="h-3 w-3 text-orange-500" />
					{:else}
						<Heart class="h-3 w-3 text-gray-400/40" />
					{/if}
				</button>
			</div>
	{/each}
</div>
