<script lang="ts">
    import ClientProfessionals from './components/ClientProfessionals.svelte';
    import SearchBox from './components/SearchBox.svelte';
   // import type { ProfessionalsData } from '$lib/types/professional';

   // export let initialData: ProfessionalsData;
</script>

<div class="min-h-screen bg-zinc-50">
    <!-- {/* Hero Section */} -->
    <section class="relative overflow-hidden">
        <div class="max-w-5xl mx-auto px-4 sm:px-[22px] py-24 pt-64">
        <div class="text-center">
            <h1 class="font-sourceserif text-4xl md:text-6xl font-[400] text-gray-900 tracking-wide mb-6 md:leading-[1.2]">
            Discover <span class="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">top, local trusted</span> tradespeople
            </h1>
            <p class="text-xl text-gray-900 max-w-2xl mx-auto mb-8 tracking-wide font-sans font-normal">
            Connect with experienced, community-recommended professionals for
            your home improvement projects
            </p>
            <!-- <SearchBox /> -->
        </div>
        </div>
    </section>

    <!-- {/* Professionals Grid */} -->
    <section class="max-w-7xl mx-auto px-4 sm:px-[22px] pb-24">
        <!-- <ClientProfessionals
            professionals={initialData.professionals}
            categories={initialData.categories}
        /> -->
    </section>
</div>