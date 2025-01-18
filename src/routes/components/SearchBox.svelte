<!-- src/routes/components/SearchBox.svelte -->
<script lang="ts">
    import { MagnifyingGlass } from 'phosphor-svelte';
    import { goto } from '$app/navigation';
    
    let searchQuery = '';
    
    function handleSubmit() {
        if (searchQuery.trim()) {
            goto(`/explore-designs?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    }
</script>

<form 
    on:submit|preventDefault={handleSubmit}
    class="flex max-w-xl mx-auto"
>
    <div class="relative flex-grow">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlass weight="bold" class="h-5 w-5 text-gray-400" />
        </div>
        <input
            bind:value={searchQuery}
            type="text"
            placeholder="Search for professionals or services..."
            class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm placeholder-gray-500"
        />
    </div>
    <button
        type="submit"
        class="px-6 py-3 bg-orange-500 text-white font-medium rounded-r-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
    >
        Search
    </button>
</form>