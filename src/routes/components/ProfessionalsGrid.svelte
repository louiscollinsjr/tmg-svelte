<!-- src/routes/components/ProfessionalsGrid.svelte -->
<script lang="ts">
  import type { Professional } from "$lib/types/professional";
  import { Star, Heart } from "phosphor-svelte";
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores';
  import { get } from 'svelte/store';
  import { invalidateAll } from '$app/navigation';

  export let professionals: Professional[] = [];
  export let selectedCategory: string | null = null;
  
  let session;

  // $: {
  //     console.log('ProfessionalsGrid - Selected Category:', selectedCategory);
  //     console.log('ProfessionalsGrid - Input Professionals:', professionals);
  // }

  onMount(async () => {
      session = get(auth);
  });

  function getJoinedYear(professional: Professional) {
    if (professional.createdAt?.$date) {
      return new Date(professional.createdAt.$date).getFullYear();
    }
    return 'Recently';
  }

  async function handleSave(e: Event, professionalId: string, isFavorite: boolean) {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      return;
    }

    try {
      const response = await fetch(`/api/professionals/${professionalId}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isFavorite: !isFavorite })
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }

      await invalidateAll();
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  }
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each professionals as professional (professional._id?.$oid || professional._id)}
       <a href={`/profile/${professional._id}`} class="relative block" >
        <div  class="pr-3 py-3 hover:bg-gray-50 transition-colors h-full relative bg-gray-100 p-4 pb-16 rounded-lg  ">
          <div class="flex items-center mb-3">
            <div class="flex-shrink-0 relative w-16 h-16">
            {#if professional.image}
              <img
                src={professional.image}
                  alt={professional.name}
                class="absolute inset-0 w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
              />
             {:else}
                <div class="absolute inset-0 w-full h-full rounded-full bg-orange-500 flex items-center justify-center text-white font-medium shadow-sm">
                  {professional.name.split(' ').map(word => word[0]).slice(0, 2).join('').toUpperCase()}
                </div>
              {/if}
            </div>
              <div class="ml-3 min-w-0">
               <h3 class="text-sm font-medium text-gray-900 truncate font-roboto tracking-wide">
                   {professional.name}
                </h3>
                {#if professional.businessInfo?.companyName}
                <p class="text-xs text-gray-500 truncate mt-0 font-roboto">{professional.businessInfo.companyName}</p>
                {/if}
                <p class="text-xs text-gray-500 mt-0 font-roboto">
                  Joined {getJoinedYear(professional)}
                </p>
            </div>
          </div>

          <div class="flex items-center gap-1 mt-1">
              
            <Star class="w-3 h-3 text-gray-900" weight="fill" />
            <span class="text-xs text-gray-900">{professional.rating?.toFixed(1) || '0.0'}</span>
              <span class="text-xs text-gray-500 ml-1">• {professional.reviewCount || 0} {professional.reviewCount == 1 ? 'Review' : 'Reviews'}</span>
                {#if professional.isFavorite}
                    <span class="ml-2 px-1.5 py-0.5 text-[10px] font-medium bg-gray-900 text-white rounded">
                     <b>tmg.</b> Choice
                    </span>
                {/if}
          </div>
        
          <!-- <p class="text-xs text-gray-600 mt-1 truncate">
            {professional.businessInfo?.specialties?.join(', ') || 'Various Services'}
          </p> -->
          
         {#if professional.projectImages && professional.projectImages.length > 0}
         <div class="relative mt-4 w-full aspect-square">
           <img
             src={professional.projectImages[0].url}
             alt={professional.projectImages[0].caption || "Project preview"}
             class="object-cover rounded-xl absolute inset-0 w-full h-full"
           />
         </div>
         {:else}
             <div class="relative mt-4 w-full aspect-square">
              <div class="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
                   <p class="text-gray-300 text-sm">No project images</p>
              </div>
             </div>
         {/if}
        
       <button class="absolute bottom-3 left-3 bg-gray-200/80 text-gray-400 font-roboto font-normal px-6 py-1 rounded-lg hover:bg-gray-800 transition-colors text-xs">
            Get Estimate
       </button>
       <button
          on:click={(e) => handleSave(e, professional._id?.$oid || professional._id, professional.isFavorite)}
        class="absolute bottom-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
         {#if professional.isFavorite}
            <Heart weight="fill" class="w-3 h-3 text-red-500/40" />
         {:else}
            <Heart class="w-3 h-3 text-gray-400/40" />
        {/if}
        </button>
       </div>
        </a>
  {/each}
</div>