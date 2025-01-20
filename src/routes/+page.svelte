<!-- src/routes/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import type { Professional } from '$lib/types/professional';
    import { transformProfessional } from '$lib/types/professional';
    import ProfessionalsGrid from './components/ProfessionalsGrid.svelte';
    import SearchBox from './components/SearchBox.svelte';
    import ServiceCategoryFilter from './components/ServiceCategoryFilter.svelte';
    import type { PageData } from './$types';

    export let data: PageData;

    let selectedCategory: string | null = null;
    let professionals: Professional[] = [];
    let filteredProfessionals: Professional[] = [];

    onMount(async () => {
        try {
            if (data?.professionals) {
                console.log('Available Categories:', data.categories.map(c => c.slug));
                console.log('Parent - Selected Category:', selectedCategory);
                console.log('Parent - All Professionals:', data.professionals);
                
                professionals = data.professionals.map(professional => {
                    const transformed = transformProfessional(professional);
                    console.log('Transformed Professional:', {
                        name: transformed.name,
                        selectedServices: transformed.selectedServices
                    });
                    return transformed;
                });
                
                console.log('Parent - Filtered Professionals:', professionals);
            }
        } catch (error) {
            console.error('Error fetching professionals:', error);
            professionals = [];
        }
    });

    $: {
        console.log('Selected Category:', selectedCategory);
        if (selectedCategory && selectedCategory !== 'all-professionals') {
            const filtered = professionals.filter(p => {
                console.log('Checking professional:', {
                    name: p.name,
                    selectedServices: p.selectedServices
                });
                const hasMatchingService = p.selectedServices?.some(service => {
                    console.log('Comparing:', {
                        serviceCategory: service.categoryId,
                        selectedCategory,
                        professional: p.name
                    });
                    return service.categoryId === selectedCategory;
                });
                return hasMatchingService;
            });
            console.log('Filtered Professionals:', filtered);
            filteredProfessionals = filtered;
        } else {
            filteredProfessionals = professionals;
        }
    }

    function handleCategorySelect(slug: string | null) {
        selectedCategory = slug;
    }
</script>

<div class="min-h-screen bg-zinc-50">
    <!-- {/* Hero Section */} -->
    <section class="relative overflow-hidden">
        <div class="mx-auto max-w-5xl px-4 py-24 pt-64 sm:px-[22px]">
            <div class="text-center">
                <h1
                    class="mb-6 font-sourceserif text-4xl font-[400] tracking-wide text-gray-900 md:text-6xl md:leading-[1.2]"
                >
                    Discover <span
                        class="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
                        >top, local trusted</span
                    > tradespeople
                </h1>
                <p class="mx-auto mb-8 max-w-2xl font-sans text-xl font-normal tracking-wide text-gray-900">
                    Connect with experienced, community-recommended professionals for your home improvement
                    projects
                </p>
                <SearchBox />
            </div>
        </div>
    </section>

    <!-- {/* Categories Section Service Categories */} -->
    <section class="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-[22px]">
        <ServiceCategoryFilter 
            categories={data.categories}
            {selectedCategory}
            on:categorySelect={e => handleCategorySelect(e.detail)} 
        />
    </section>

    <!-- {/* Professionals Grid */} -->
    <section class="mx-auto max-w-7xl px-4 pb-24 sm:px-[22px]">
        <ProfessionalsGrid professionals={filteredProfessionals} {selectedCategory} />
    </section>
</div>