<!-- src/routes/find-pro/+page.svelte -->
<script lang="ts">
    import type { PageData } from './$types';
    import ProfessionalsGrid from '../components/ProfessionalsGrid.svelte';
    import { ArrowLeft, MagnifyingGlass, Sliders } from 'phosphor-svelte';

    export let data: PageData;
</script>

<svelte:head>
    <title>Find a Professional | TMG</title>
    <meta name="description" content="Find the perfect professional for your project" />
</svelte:head>

<main>
    <div class="bg-white">
        <!-- Hero Section -->
        <div class="relative isolate overflow-hidden ">
            <div class="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:px-8">
                <!--icon navigation bar -->
                <div class="flex items-center justify-between p-6">
                    <button class="p-3 rounded-full bg-gray-100 hover:bg-gray-200" on:click={() => history.back()}>
                        <ArrowLeft class="h-4 w-4 text-gray-600" />
                    </button>
                    <!-- <div class="flex gap-2">
                        <button class="p-3 bg-gray-100 hover:bg-gray-100 rounded-full">
                            <MagnifyingGlass class="h-4 w-4 text-gray-600" />
                        </button>
                        <button class="p-3 bg-gray-100 hover:bg-gray-100 rounded-full">
                            <Sliders class="h-4 w-4 text-gray-600" />
                        </button>
                    </div> -->
                </div>
                <div class="flex justify-center items-center ">
                    <div class="text-center max-w-2xl px-6 ">
                        <h1 class="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl font-sourceserif">
                            Qualified <span
                            class="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
                            >tradespeople</span> for your new project
                        </h1>
                        <p class="mt-6 text-lg leading-8 text-gray-600">
                            Meet the experts who specialize in the skills needed for your project.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Professionals Grid -->
        <section class="mx-auto max-w-7xl px-4 pb-24 sm:px-[22px">
            <div class="pb-24 border-b border-gray-200 px-10">
            <ProfessionalsGrid {data} professionals={data.professionals} selectedCategory={data.selectedCategory.slug} />
            </div>
            <p class="text-[9pt] text-gray-500 pt-2">Can't find a tradesperson here? <a href="/help-center" class="underline">Visit the Help Center</a></p>
        </section>
      
       
    </div>
</main>
