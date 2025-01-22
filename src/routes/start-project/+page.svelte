<!-- src/routes/start-project/+page.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	import { FileArrowUp, CaretRight, Camera, KeyReturn, ArrowLeft, X } from 'phosphor-svelte';
    import { signIn } from '@auth/sveltekit/client';

	export let data;
	let currentStep = writable(1);
	let formData = writable({
		title: '',
		description: '',
		projectType: '',
		images: [],
		budget: '',
		timeline: '',
		name: '',
		city: '',
		state: '',
		status: 'planning'
	});

	$: isLastStep = $currentStep === 6;
	$: isFirstStep = $currentStep === 1;

	function nextStep() {
		if ($currentStep < 5) {
			currentStep.update((n) => n + 1);
		}
	}

	function prevStep() {
		if ($currentStep > 1) {
			currentStep.update((n) => n - 1);
		}
	}

	async function handleImageUpload(event) {
		const files = event.target.files;
		if (files) {
			const newImages = [];
			for (let file of files) {
				// Here you would typically upload to your server/cloud storage
				// For now, we'll create object URLs
				const url = URL.createObjectURL(file);
				newImages.push({
					url,
					caption: file.name
				});
			}
			formData.update((data) => ({
				...data,
				images: [...data.images, ...newImages]
			}));
		}
	}

	async function handleSubmit(event) {
		if (!isLastStep) {
			nextStep();
			return;
		}

		// Final submission
		const form = event.target;
		const formDataObj = new FormData(form);

		try {
			const response = await fetch('?/createProject', {
				method: 'POST',
				body: formDataObj
			});

			if (response.ok) {
				// Redirect to project page or show success message
				window.location.href = '/projects';
			}
		} catch (error) {
			console.error('Error submitting project:', error);
		}
	}
</script>

<div class="mx-auto min-h-screen bg-[#f8f7f3] py-12 pt-64">
	<div
		class="relative mx-auto flex min-h-[600px] max-w-5xl flex-col overflow-hidden rounded-xl bg-[#f8f7f3] pb-24 shadow-xl"
	>
		<div class="flex items-center justify-between px-8 pt-8">
			<div class="flex items-center gap-x-3 space-x-2">
				<p class="text-sm font-bold text-gray-900">trymyguys.</p>
				<p class="text-xs font-normal text-gray-600">Start a Project</p>
			</div>
			<button
				class="absolute right-8 top-8 text-gray-400 transition-colors hover:text-gray-600"
				on:click={() => window.history.back()}
			>
				<div class="flex items-center space-x-2 text-xs">
					<span>Close</span>
					<X weight="bold" class="h-3 w-3" />
				</div>
			</button>
		</div>

		<!-- Progress bar -->
		<div class="absolute left-0 top-0 h-0.5 w-full">
			<div
				class="h-full rounded-tl-xl bg-[#ff6923] transition-all duration-300 ease-in-out"
				style="width: {(($currentStep - 1) / 5) * 100}%"
				class:rounded-tr-xl={$currentStep === 5}
			></div>
		</div>

		<div class="flex flex-1 items-center justify-center">
			<div class="w-full max-w-3xl">
				<form on:submit|preventDefault={handleSubmit} class="w-full p-8">
					<!-- Navigation buttons -->
					<div class="mt-8 flex justify-between">
						{#if !isFirstStep}
							<button
								type="button"
								on:click={prevStep}
								class="px-0 py-2 text-gray-600 underline hover:text-gray-900"
							>
								<div class="flex items-center gap-2 pb-8 text-xs">
									<ArrowLeft class="h-4 w-4" />
									<p>Back</p>
								</div>
							</button>
						{:else}
							<div class="flex items-center gap-2 pt-8"></div>
						{/if}
					</div>
					<!-- Step 1: Welcome -->
					{#if $currentStep === 1}
						<div class="space-y-4">
							<h2 class="font-sourceserif text-3xl font-normal text-gray-900">
								Let&apos;s Find the <span
                                class="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
                                >Perfect Professional</span
                            > for Your Project!
							</h2>
							<p class="text-sm text-gray-500">
								We&apos;ll help you find the perfect professional for your home improvement project. <br
								/> This will take about 3 minutes.
							</p>
						</div>
					{/if}

					<!-- Step 2: Project Details -->
					{#if $currentStep === 2}
						<div class="space-y-6">
							<h2 class="font-sourceserif text-3xl font-normal text-gray-900">Tell us about your project</h2>

							<div>
								<label for="project-type" class="mb-2 block text-sm font-medium text-gray-700">Project Type</label>
								<div class="relative">
									<select
										id="project-type"
										bind:value={$formData.projectType}
										class="w-full appearance-none rounded-lg border border-gray-300 bg-[#f8f7f3] px-3 py-2 pr-12 focus:border-black focus:ring-black"
										required
									>
										<option value="">Select a project type</option>
										{#each data.serviceCategories || [] as category}
											<option value={category._id}>{category.name}</option>
										{/each}
									</select>
									<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
										<svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
											<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
										</svg>
									</div>
								</div>
							</div>

							<div>
								<label for="project-description" class="mb-2 block text-sm font-medium text-gray-700"
									>Project Description</label
								>
								<textarea
									id="project-description"
									bind:value={$formData.description}
									class="w-full rounded-lg border border-gray-300 bg-[#f8f7f3] px-3 py-2 focus:border-black focus:ring-black"
									rows="4"
									placeholder="Describe your project in detail..."
									required
								></textarea>
							</div>

							
						</div>
					{/if}

					<!-- Step 3: Project Details Images-->
					{#if $currentStep === 3}
						<div class="space-y-6">
							<div class="space-y-4">
								<h2 class="font-sourceserif text-3xl font-normal text-gray-900">
									Upload photos (optional)
								</h2>
								<p class="text-sm text-gray-500">
									Help us help you! Upload images of the room or area you want to improve. This
									allows our professionals to provide a more accurate remote estimate and better
									understand your needs. The more details we have, the better we can match you with
									the right expert!
								</p>
							</div>

							<div>
								<label for="optional-photos" class="mb-2 block text-sm font-medium text-[#f7f8f3]"
									>Upload Photos (optional)</label
								>
								<div
									class="mt-1 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 pb-6 pt-5"
								>
									<div class="space-y-1 text-center">
										<Camera class="mx-auto h-12 w-12 text-gray-400" />
										<div class="flex text-sm text-gray-600">
											<label
												class="relative cursor-pointer rounded-md bg-white font-medium text-black hover:text-gray-700"
											>
												<span>Upload files</span>
												<input
													type="file"
													class="sr-only"
													multiple
													accept="image/*"
													on:change={handleImageUpload}
												/>
											</label>
											<p class="pl-1">or drag and drop</p>
										</div>
										<p class="text-xs text-gray-500">PNG, JPG up to 10MB</p>
									</div>
								</div>
								{#if $formData.images.length > 0}
									<div class="mt-4 grid grid-cols-3 gap-4">
										{#each $formData.images as image}
											<img
												src={image.url}
												alt={image.caption}
												class="h-24 w-full rounded-lg object-cover"
											/>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Step 4: Budget and Timeline -->
					{#if $currentStep === 4}
						<div class="space-y-6">
							<div class="space-y-4">
								<h2 class="font-roboto text-2xl font-normal text-gray-900">
									Budget and Timeline (optional)
								</h2>
								<p class="text-sm text-gray-500">
									Sharing your budget and preferred timeline helps us connect you with the right
									professionals who can meet your needs efficiently. This information ensures
									accurate estimates and smooth project planning from the start.
								</p>
							</div>

							<div>
								<label for="budget-range" class="mb-2 block text-sm font-medium text-gray-700">Budget Range</label>
								<div class="relative">
									<select
										id="budget-range"
										bind:value={$formData.budget}
										class="w-full appearance-none rounded-lg border border-gray-300 bg-[#f8f7f3] px-3 py-2 pr-10 focus:border-black focus:ring-black"
										required
									>
										<option value="">Select a budget range</option>
										<option value="0-5000">$0 - $5,000</option>
										<option value="5000-15000">$5,000 - $15,000</option>
										<option value="15000-30000">$15,000 - $30,000</option>
										<option value="30000-50000">$30,000 - $50,000</option>
										<option value="50000+">$50,000+</option>
									</select>
									<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
										<svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
											<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
										</svg>
									</div>
								</div>
							</div>

							<div>
								<label for="timeline" class="mb-2 block text-sm font-medium text-gray-700">Timeline</label>
								<div class="relative">
									<select
										id="timeline"
										bind:value={$formData.timeline}
										class="w-full appearance-none rounded-lg border border-gray-300 bg-[#f8f7f3] px-3 py-2 pr-10 focus:border-black focus:ring-black"
										required
									>
										<option value="">When do you want to start?</option>
										<option value="immediately">Right away</option>
										<option value="1-2weeks">Within 1-2 weeks</option>
										<option value="1month">Within 1 month</option>
										<option value="2-3months">2-3 months</option>
										<option value="planning">Just planning</option>
									</select>
									<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
										<svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
											<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
										</svg>
									</div>
								</div>
							</div>
						</div>
					{/if}

					<!-- Step 5: About You -->
					{#if $currentStep === 5}
						<div class="space-y-6">
							<div class="space-y-4">
								<h2 class="font-roboto text-2xl font-normal text-gray-900">
									A little about you
								</h2>
								<p class="text-sm text-gray-500">
									For security purposes, we only collect your name, city, and state at this stage. Once you begin working with a tradesperson, we&apos;ll gather additional information to ensure a smooth and secure process.
								</p>
							</div>

							<div>
								<label for="name" class="mb-2 block text-sm font-medium text-gray-700">Name</label>
								<input
									id="name"
									type="text"
									bind:value={$formData.name}
									class="w-full rounded-lg border border-gray-300 bg-[#f8f7f3] px-3 py-2 focus:border-black focus:ring-black"
									required
								/>
							</div>

							<div class="grid grid-cols-2 gap-4">
								<div>
									<label for="city" class="mb-2 block text-sm font-medium text-gray-700">City</label>
									<input
										id="city"
										type="text"
										bind:value={$formData.city}
										class="w-full rounded-lg border border-gray-300 bg-[#f8f7f3] px-3 py-2 focus:border-black focus:ring-black"
										required
									/>
								</div>
								<div>
									<label for="state" class="mb-2 block text-sm font-medium text-gray-700">State</label>
									<input
										id="state"
										type="text"
										bind:value={$formData.state}
										class="w-full rounded-lg border border-gray-300 bg-[#f8f7f3] px-3 py-2 focus:border-black focus:ring-black"
										required
									/>
								</div>
							</div>
						</div>
					{/if}

					<!-- Step 6: Sign In -->
					{#if $currentStep === 6}
						<div class="space-y-6">
                            <div class="flex items-center justify-between gap-12">
                                <div class="space-y-6 w-1/2">
                                    <div class="space-y-4">
                                        <h2 class="font-roboto text-2xl font-normal text-gray-900">
                                            Ready to get started?
                                        </h2>
                                        <p class="text-sm text-gray-500">
                                            Sign in or create an account to save your project and get matched with professionals.
                                        </p>
                                    </div>
                                    
                                    <div class="space-y-4">
                                        <button
                                            type="button"
                                            on:click={() => signIn('google', { callbackUrl: '/start-project', action: 'login' })}
                                            class="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors hover:bg-gray-50"
                                        >
                                            <img src="/images/google-icon-logo.svg" alt="Google" class="h-5 w-5" />
                                            Continue with Google
                                        </button>
                                        
                                        <div class="relative">
                                            <div class="absolute inset-0 flex items-center">
                                                <div class="w-full border-t border-gray-200"></div>
                                            </div>
                                            <div class="relative flex justify-center text-sm">
                                                <span class="bg-[#f8f7f3] px-2 text-gray-500">or</span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                        >
                                            Continue as guest
                                        </button>
                                    </div>

                                    <p class="text-center text-xs text-gray-500">
                                        By continuing, you agree to our Terms of Service and Privacy Policy
                                    </p>
                                </div>
                                <div class="w-1/2 bg-[#d1d0cc] rounded-3xl p-3 pb-20">
                                    <div class="space-y-4 bg-gray-50 p-10 rounded-3xl">
                                        <h3 class="text-lg font-medium text-gray-900">Why create an account?</h3>
                                        <ul class="space-y-3 text-sm text-gray-600">
                                            <li class="flex items-start gap-2">
                                                <span class="mt-0.5 text-green-500">✓</span>
                                                Save and track your project progress
                                            </li>
                                            <li class="flex items-start gap-2">
                                                <span class="mt-0.5 text-green-500">✓</span>
                                                Get matched with verified professionals
                                            </li>
                                            <li class="flex items-start gap-2">
                                                <span class="mt-0.5 text-green-500">✓</span>
                                                Secure messaging and file sharing
                                            </li>
                                            <li class="flex items-start gap-2">
                                                <span class="mt-0.5 text-green-500">✓</span>
                                                Access to project management tools
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                               
                            </div>
                        </div>
					{/if}

					<!-- Navigation buttons -->
					<div class="mt-8 flex justify-between">
						<!-- {#if !isFirstStep}
                    <button 
                        type="button"
                        on:click={prevStep}
                        class="px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                        Back
                    </button>
                {:else} 
                    <div></div>
                {/if} -->
						<div class="flex items-center gap-6">
							<button
								type="submit"
								class="flex items-center gap-2 rounded-3xl bg-[#ff6923] px-7 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#ff6923]/80"
							>
								{isLastStep ? 'Submit' : 'Next'}
								<!-- {#if !isLastStep}
                        <CaretRight class="w-4 h-4" />
                    {/if} -->
							</button>
							<p class="flex items-center gap-1 text-xs font-extralight text-gray-600">
								<KeyReturn weight="fill" class="h-6 w-6 text-gray-300 " /> or Press Enter
							</p>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	/* Add any custom styles here */
</style>
