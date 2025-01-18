<!-- src/routes/components/ClientProfessionals.svelte -->
<script lang="ts">
    import type { Professional, ServiceCategory } from "$lib/types/professional";
    import ServiceCategoryFilter from "./ServiceCategoryFilter.svelte";
    import ProfessionalsGrid from "./ProfessionalsGrid.svelte";

    export let professionals: Professional[];
    export let categories: ServiceCategory[];

    let selectedCategory: ServiceCategory | null = null;
    let filteredProfessionals = professionals;

    function handleCategorySelect(category: ServiceCategory | null) {
        selectedCategory = category;
        filteredProfessionals = category 
            ? professionals.filter(p => p.category.id === category.id)
            : professionals;
    }
</script>

<div class="grid grid-cols-12 gap-8">
    <div class="col-span-3">
        <ServiceCategoryFilter
            {categories}
            {selectedCategory}
            onCategorySelect={handleCategorySelect}
        />
    </div>
    <div class="col-span-9">
        <ProfessionalsGrid professionals={filteredProfessionals} />
    </div>
</div>