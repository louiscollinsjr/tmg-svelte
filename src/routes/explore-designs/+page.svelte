<!-- src/routes/explore-designs/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import type { ProjectImage } from '$lib/types/professional';
    import ImageWithLoading from '../components/ImageWithLoading.svelte';
    import { Heart } from 'phosphor-svelte';

    let allImages: string[] = [];
    let visibleImages: string[] = [];
    let loading: boolean = false;
    let page: number = 1;
    const pageSize = 12;
    let categories = ['For you', 'Featured', 'New', 'Following'];
    let selectedCategory = 'For you';
    let selectedFilter = 'Newest';
    const filters = ['Newest', 'Oldest', 'Most Viewed', 'Most Liked'];

    function loadMoreImages() {
      if (loading) {
        return;
      }
       
        loading = true;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
         const nextImages = allImages.slice(startIndex, endIndex);

        if (nextImages.length > 0) {
            visibleImages = [...visibleImages, ...nextImages];
             page += 1;
         }
           loading = false;
        }
    

    function handleFilterSelect(filter: string) {
        selectedFilter = filter;
        console.log('Selected Filter:', selectedFilter);
    }
    function handleCategorySelect(category: string) {
         selectedCategory = category;
           console.log('Selected Category:', selectedCategory);
    }

    onMount(() => {
        loadImages();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });

    async function loadImages() {
        try {
            console.log('Starting to load images...');
            const imageFiles = import.meta.glob('../../explore-designs/*.(png|jpg|jpeg|gif|svg)', { eager: true });
            console.log('Image files found:', Object.keys(imageFiles));
            
            allImages = Object.values(imageFiles).map((image) => {
                const imagePath = (image as { default: string }).default;
                console.log('Processing image path:', imagePath);
                return imagePath;
            });
            
            if (allImages.length === 0) {
                console.warn('No images found in the specified directory');
            } else {
                console.log('Successfully loaded images:', allImages);
            }
            
            loadMoreImages();
        } catch (err) {
            console.error('Error loading images:', err);
            console.error('Error details:', { 
                name: err.name, 
                message: err.message, 
                stack: err.stack 
            });
            allImages = [];
        }
    }

    function handleScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        if (scrollY + windowHeight >= documentHeight - 200) {
          loadMoreImages()
       }
    };
</script>

<div class="min-h-screen bg-gray-50 pt-48">
 
     <div class="max-w-7xl mx-auto px-4 sm:px-[22px] py-16">
        <div class="flex items-center justify-between">
            <!-- <h1 class="text-3xl font-medium text-black tracking-tight">Explore</h1> -->
            <div class="text-left">
				<h1
					class="mb-6 font-sourceserif text-4xl font-[400] tracking-wide text-gray-900 md:text-6xl md:leading-[1.2]"
				>
					Find inspiration for your <span
						class="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
						>perfect project.</span
					>
				</h1>
                <p class=" mb-8 max-w-2xl font-sans text-xl font-normal tracking-wide text-gray-900">
                    Discover stunning interiors and exteriors to inspire your next project. From modern makeovers to classic designs, find the perfect look for your home.
                </p>
			</div>
             <!-- <div class="flex items-center gap-4">
                <div class="flex items-center space-x-2">
                  {#each categories as category}
                     <button
                       on:click={() => handleCategorySelect(category)}
                       class={`px-3 py-1  rounded-full font-medium hover:bg-gray-200 transition-colors ${selectedCategory === category ? 'bg-gray-300 text-gray-900' : 'text-gray-500'} text-sm`}
                    >
                      {category}
                     </button>
                  {/each}
                </div>
                  <div class="relative">
                      <button  class="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1">
                           Filter  {selectedFilter} 
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                      </button>
                
                 </div>
            </div> -->
        </div>
        
        <div class="mt-8 columns-1 md:columns-2 lg:columns-4 gap-4 pt-8 space-y-4">
            {#each visibleImages as image}
                <div class="group relative break-inside-avoid rounded-xl bg-gray-50 overflow-hidden">
                    <ImageWithLoading 
                        src={image} 
                        alt="Design preview"
                        aspectRatio={Math.random() * (1.5 - 0.8) + 0.8}
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none">
                    </div>
                    <div class="absolute bottom-5 right-5 flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] text-white">
                        <Heart class="w-3 h-3 text-white" />
                        <span>{Math.floor(Math.random() * 999)}</span>
                    </div>
                    <div class="absolute bottom-5 left-5 flex items-center justify-center w-6 h-6 rounded-full bg-black/80 backdrop-blur-sm">
                        <span class="text-[9px] font-normal text-white">tmg</span>
                    </div>
                </div>
            {/each}
        </div>

        {#if loading}
            <div class="mt-8 flex justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        {/if}
    </div>
</div>