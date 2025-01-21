<!-- src/routes/find-work/+page.svelte -->
<script lang="ts">
	import PricingTiers from '../components/PricingTiers.svelte';
</script>

<div class="min-h-screen pt-32">
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

	<!-- {/* Pricing Section */} -->
	<div class="bg-gray-50">
		<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
			<div class="text-center">
				<h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Choose your plan</h2>
				<p class="mt-4 text-lg text-gray-600">Select the perfect plan for your business needs</p>
			</div>
			<div class="mt-16">
				<PricingTiers />
			</div>
		</div>
	</div>
</div>
