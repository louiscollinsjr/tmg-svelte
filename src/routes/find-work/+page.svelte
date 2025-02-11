<!-- src/routes/find-work/+page.svelte -->
<script lang="ts">
    import PricingTiers from '../components/PricingTiers.svelte';
    import ProjectList from '../components/ProjectList.svelte';
    import { MagnifyingGlass } from 'phosphor-svelte';
    import { onMount } from 'svelte';
    import type { PageData } from './$types';
	import BackgroundPattern from '../components/BackgroundPattern.svelte';

    export let data: PageData;
    let { userData, session, pendingProjects } = data;
    let searchQuery = '';
    
    $: filteredProjects = pendingProjects.filter(project => {
        const searchLower = searchQuery.toLowerCase();
        return (
            project.title?.toLowerCase().includes(searchLower) ||
            project.description?.toLowerCase().includes(searchLower) ||
            project.city?.toLowerCase().includes(searchLower) ||
            project.state?.toLowerCase().includes(searchLower) ||
            project.skills?.some(skill => skill.toLowerCase().includes(searchLower))
        );
    });

    console.log('Find work Session:', session);
    console.log('Find work User data:', userData);

    console.log('Pending projects:', pendingProjects);


    const benefits = [
    {
        title: "Present yourself and your work in a more compelling way.",
        subtitle: "Get matched with projects that align with your skills and schedule.",
        image: "", 
        flexColReverse: true,
        // cta: "Learn More",
        // ctaLink: "/learn-more/easy-job-matching"
    },
    {
        title: "Steady Work",
        subtitle: "Enjoy a steady flow of job opportunities—no client searching needed.",
        image: "", // Replace with actual image path
        flexColReverse: false,
        // cta: "Explore Opportunities",
        // ctaLink: "/learn-more/steady-work"
    },
    {
        title: "Direct Connections",
        subtitle: "Communicate easily with homeowners to ask questions and build trust.",
        image: "", // Replace with actual image path
        flexColReverse: true,
        // cta: "Connect Now",
        // ctaLink: "/learn-more/direct-connections"
    },
    {
        title: "Expand Your Network",
        subtitle: "Connect with homeowners and professionals to unlock new opportunities.",
        image: "", // Replace with actual image path
        flexColReverse: false,
        cta: "Join Us",
        ctaLink: "/learn-more/expand-network"
    }
];

</script>
<!-- <BackgroundPattern opacity="0.05" patternClassName="bg-[#ffffff]/100" /> -->
<div class="relative z-10 min-h-screen py-40">
   
    {#if session?.user && userData?.isPro}
    <div class="relative z-10">
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
            <div class="px-12 mb-10">
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlass size={18} class="text-gray-700" />
                    </div>
                    <input
                        type="text"
                        bind:value={searchQuery}
                        placeholder="Search by skill, location, room..."
                        class="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm placeholder:font-thin placeholder:text-gray-700"
                    />
                </div>
            </div>
            
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-2xl px-12">Recent Projects</h2>
            <p class="mt-4 text-lg text-gray-500 px-12">Here are the latest projects matching your skills.</p>
            
            <div class="mt-8">
                {#if filteredProjects.length > 0}
                    <ProjectList projects={filteredProjects} />
                {:else}
                    <p class="text-gray-500 px-10">No projects match your search. Try different keywords!</p>
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

    <section class="py-16 pb-32">
        <div class="mt-12 max-w-7xl mx-auto">
            <!-- <h2 class="text-4xl font-bold text-gray-900 text-center mb-8 font-sourceserif">How It Works</h2> -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-8">
                <div class="bg-white border border-light-gray rounded-2xl p-12 text-center">
                    <img src="/images/howItWorks/Frame143.jpg" alt="Sign Up" class="mx-auto mb-2 w-48 h-48 grayscale" />
                    <span class="font-semibold text-gray-800 text-2xl">Sign Up</span>
                    <p class="mt-2 text-gray-600 font-opensans">Create your free profile and set your preferred service area.</p>
                </div>
                <div class="bg-white border border-light-gray rounded-2xl p-12 text-center">
                    <img src="/images/howItWorks/Frame144.jpg" alt="Set up Your Profile" class="mx-auto mb-2 mt-5 w-48 h-48 grayscale" />
                    <span class="font-semibold text-gray-800 text-2xl">Set up Your Profile</span>
                    <p class="mt-2 text-gray-600 font-opensans">Setup your profile with specific types of work that you do.</p>
                </div>
                <div class="bg-white border border-light-gray rounded-2xl p-12 text-center">
                    <img src="/images/howItWorks/Frame145.jpg" alt="Get Contacted" class="mx-auto mb-2 mt-5 w-48 h-48 grayscale" />
                    <span class="font-semibold text-gray-800 text-2xl">Get Connected</span>
                    <p class="mt-2 text-gray-600 font-opensans">Start getting matched with the perfect jobs, and contact homeowners.</p>
                </div>
            </div>
          </div>
    </section>


    <section class="py-32">
        <div class="mt-12 max-w-7xl mx-auto">
            {#each benefits as benefit}
            <div class={`flex flex-rowmx-auto mb-16 px-4 py-8 gap-20 items-center ${benefit.flexColReverse ? 'flex-row-reverse' : ''}`}>
                <div class="text-center lg:text-left w-1/3">
                    <h2 class="text-4xl font-bold mb-4 w-80">{benefit.title}</h2>
                    <p class="text-gray-600 text-lg mb-6 w-96">{benefit.subtitle}</p>
                    {#if benefit.cta}
                    <a href={benefit.ctaLink} class="bg-[#ff5a00] text-white rounded-full py-4 font-bold px-20 text-center text-sm transition duration-300 hover:bg-gray-800">
                        {benefit.cta}
                    </a>
                    {/if}
                </div>
                <div class="relative bg-gray-100 w-2/3 h-[400px] rounded-xl">
                    {#if benefit.image !== ""}
                    <img src={benefit.image} alt={benefit.title} class="w-full h-auto rounded-lg shadow-lg" />
                    {/if}
                </div>
            </div>
        {/each}
        </div>
    </section>

    
    <section class="pt-16 ">
        <div class="mt-12 text-center">
            <p class="text-4xl font-extrabold sm:text-6xl text-[#ff5a00]  font-sourceserif pb-4">Ready to grow your business?</p> 
            <p class="text-4xl font-extrabold text-gray-900 sm:text-4xl font-sourceserif"> Choose the plan that is right for you!</p>
         </div>
    

	<!-- {/* Pricing Section */} -->
	<div class="">
		<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
			<div class="text-center">
				<!-- <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Choose your plan</h2> -->
				<p class="mt-4 text-lg text-gray-800 z-1000">Select the perfect plan for your business needs</p>
			</div>
			<div class="mt-16">
				<PricingTiers userSubscription={userData?.subscription} />
			</div>
		</div>
	</div>
</section>
    {/if}
</div>
