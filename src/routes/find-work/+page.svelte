<!-- src/routes/find-work/+page.svelte -->
<script lang="ts">
    import PricingTiers from '../components/PricingTiers.svelte';
    import ProjectList from '../components/ProjectList.svelte';
    import { page } from '$app/state';

    
    let session = $derived(page.data.session);
    let userData = $derived(page.data.userData);
    console.log('Find work Session:', session, 'Find workUser data:', userData);

    let pendingProjects = page.data.pendingProjects;
   console.log('Pending projects:',page.data.pendingProjects);
    
    console.log('Pending projects:', pendingProjects);

</script>

<div class="min-h-screen py-40">
    {#if session?.user && userData.isPro}
    <div class="">
		<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
			<div class="text-center">
				<h1
					class="mb-6 font-sourceserif text-4xl font-[400] tracking-wide text-gray-900 md:text-6xl md:leading-[1.2]"
				>
					Find your <span
						class="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
						>next project.</span
					>
				</h1>
                <p class="mx-auto mb-8 max-w-2xl font-sans text-lg font-normal tracking-wide text-gray-900">
                    Explore a list of local jobs tailored to your skills. Choose the projects that fit your schedule and expertise—your next great opportunity is just a click away.
                </p>
			</div>
		</div>
	</div>
        <!-- Authenticated Pro users see pending projects -->
        <div class="mx-auto max-w-6xl px-4">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl px-20">Available Projects</h2>
            <p class="mt-4 text-lg text-gray-500 px-20">Here are the latest projects matching your skills.</p>
            
            <div class="mt-8">
                {#if pendingProjects.length > 0}
                    <ProjectList projects={pendingProjects} />
                {:else}
                    <p class="text-gray-500 px-20">No projects available at the moment. Check back soon!</p>
                {/if}
            </div>
        </div>
    {:else}

<!-- else Non-authenicated users show join community and pricing tiers below  -->

	<!-- {/* Hero Section */} -->
	<div class="">
		<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
			<div class="text-center">
				<h1
					class="mb-6 font-sourceserif text-4xl font-[400] tracking-wide text-gray-900 md:text-6xl md:leading-[1.2]"
				>
					Find the <span
						class="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
						>perfect project.</span
					>
				</h1>
                <p class="mx-auto mb-8 max-w-2xl font-sans text-xl font-normal tracking-wide text-gray-900">
                    Join our community of trusted professionals and discover local jobs that match your
					skills. The perfect project is waiting for you.
                </p>
			</div>
		</div>
	</div>

    <section class="py-16">
        <div class="mt-12 max-w-5xl mx-auto">
            <h2 class="text-4xl font-bold text-gray-900 text-center mb-8 font-sourceserif">How It Works</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <span class="font-semibold text-gray-800">1. Sign Up</span>
                     <p class="mt-2 text-gray-600">Create your free profile and set your preferred service area.</p>
                </div>
                  <div>
                    <span class="font-semibold text-gray-800">2. Set up Your Profile</span>
                     <p class="mt-2 text-gray-600">Setup your profile with specific types of work that you do.</p>
                </div>
                 <div>
                    <span class="font-semibold text-gray-800">3. Get Contacted</span>
                    <p class="mt-2 text-gray-600">Start getting matched with the perfect jobs, and contact homeowners.</p>
                </div>
            </div>
          </div>
    </section>

    <section class="py-16">
        <div class="mt-12  max-w-5xl mx-auto">
            <h2 class="text-4xl font-bold text-gray-900 text-center mb-8 font-sourceserif">Benefits of Joining TryMyGuys</h2>
            <ul class="list-none space-y-4">
            <li class="text-gray-600">  ✓ Expand your customer base with access to local homeowners.
            </li>
               <li class="text-gray-600"> ✓  Find projects that fit your skill set and expertise.
            </li>
               <li class="text-gray-600"> ✓ Use our platform tools to manage your schedule and your projects.
           </li>
                 <li class="text-gray-600"> ✓  Build your business reputation by showcasing your project portfolio.
            </li>
                 <li class="text-gray-600">✓  Control your own work schedule and availability.
            </li>
          </ul>
        </div>
    </section>

    <section class="pt-16">
        <div class="mt-12 text-center">
            <p class="text-4xl font-extrabold sm:text-4xl text-[#ff5a00] font-sourceserif">Ready to grow your business?</p> 
            <p class="text-4xl font-extrabold text-gray-900 sm:text-4xl font-sourceserif"> Choose the plan that is right for you!</p>
         </div>
    </section>

	<!-- {/* Pricing Section */} -->
	<div class="bg-gray-50">
		<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
			<div class="text-center">
				<!-- <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Choose your plan</h2> -->
				<p class="mt-4 text-lg text-gray-600">Select the perfect plan for your business needs</p>
			</div>
			<div class="mt-16">
				<PricingTiers />
			</div>
		</div>
	</div>
    {/if}
</div>
