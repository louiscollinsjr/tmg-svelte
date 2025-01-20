<!-- src/routes/components/ServiceCategoryFilter.svelte -->

<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import {
		PaintBrushBroad,
		Wrench,
		Tree,
		Pipe,
		Lightning,
		Broom,
		Bug,
		Storefront,
		Fan,
		Toolbox,
		Couch,
		Warehouse
	} from 'phosphor-svelte';

	const dispatch = createEventDispatcher<{
		categorySelect: string | null;
	}>();

	interface Category {
		slug: string;
		name: string;
		icon: string;
		description?: string;
		options?: Array<{
			id: string;
			name: string;
			slug: string;
			description: string;
			popular: boolean;
		}>;
	}

	// Props
	export let categories: Category[];
	export let selectedCategory: string | null = null;

	let scrollContainer: HTMLElement;
	let canScrollLeft = false;
	let canScrollRight = false;

	// Icon mapping - map MongoDB icon names to Phosphor icons
	const iconMap: { [key: string]: any } = {
		'paint-brush-broad': PaintBrushBroad,
		wrench: Wrench,
		tree: Tree,
		pipe: Pipe,
		lightning: Lightning,
		broom: Broom,
		bug: Bug,
		storefront: Storefront,
		fan: Fan,
		toolbox: Toolbox,
		couch: Couch,
        warehouse: Warehouse
	};

	function handleCategoryClick(slug: string): void {
		selectedCategory = selectedCategory === slug ? null : slug;
		dispatch('categorySelect', selectedCategory);
	}

	function checkScroll() {
		if (scrollContainer) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
			canScrollLeft = scrollLeft > 0;
			canScrollRight = scrollLeft + clientWidth < scrollWidth;
		}
	}

	function scroll(direction: 'left' | 'right') {
		if (scrollContainer) {
			const scrollAmount = 200;
			scrollContainer.scrollTo({
				left: scrollContainer.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount),
				behavior: 'smooth'
			});
		}
	}

	onMount(() => {
		checkScroll();
		window.addEventListener('resize', checkScroll);
		return () => window.removeEventListener('resize', checkScroll);
	});
</script>

<div class="relative mx-auto">
	{#if canScrollLeft}
		<div class="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-zinc-50 to-transparent"></div>
	{/if}

	{#if canScrollLeft}
		<button
			class="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-zinc-50"
			on:click={() => scroll('left')}
			aria-label="Scroll categories left"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	{/if}

	<div
		bind:this={scrollContainer}
		on:scroll={checkScroll}
		class="scrollbar-hide h-24 overflow-x-auto py-4"
	>
		<div class="flex h-full items-center space-x-10 px-2">
			{#each categories as category}
				<button
					on:click={() => handleCategoryClick(category.slug)}
					class={`flex cursor-pointer flex-col items-center gap-2 whitespace-nowrap px-2 text-xs text-gray-600 hover:text-gray-900 ${
						selectedCategory === category.slug ? 'text-gray-900' : ''
					}`}
				>
					<div
						class={`flex flex-col items-center gap-2 hover:underline hover:decoration-black hover:decoration-2 hover:underline-offset-[12px] ${
							selectedCategory === category.slug ? 'underline decoration-black decoration-2 underline-offset-[12px]' : ''
						}`}
					>
						{#if iconMap[category.icon]}
							<svelte:component
								this={iconMap[category.icon]}
								size={35}
								class={selectedCategory === category.slug ? 'text-gray-900' : 'text-gray-800'}
							/>
						{:else}
							<svelte:component
								this={Storefront}
								size={35}
								class={selectedCategory === category.slug ? 'text-gray-900' : 'text-gray-800'}
							/>
						{/if}
						<span>{category.name}</span>
					</div>
				</button>
			{/each}
		</div>
	</div>

	{#if canScrollRight}
		<button
			class="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-zinc-50"
			on:click={() => scroll('right')}
			aria-label="Scroll categories right"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	{/if}
</div>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
