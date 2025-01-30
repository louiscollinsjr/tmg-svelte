<!-- src/routes/start-project/+page.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import { superForm, filesProxy } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { FileArrowUp, CaretRight, Camera, KeyReturn, ArrowLeft, X } from 'phosphor-svelte';
	import { steps } from './schema';

	export let data;

	let step = 1;
	$: options.validators = zod(steps[step - 1]);

	let totalSteps = steps.length;
	$: isLastStep = step === totalSteps;
	$: isFirstStep = step === 1;

	function nextStep() {
		if (step < totalSteps) {
			step = step + 1;
		}
	}

	function prevStep() {
		if (step > 1) {
			step = step - 1;
		}
	}

	const { form, errors, message, enhance, validateForm, options } = superForm(data.form, {
		dataType: 'json',
		async onSubmit({ cancel }) {
			if (step == totalSteps) return;
            else cancel();

			const result = await validateForm();
			if (result.valid) nextStep();
		},

		async onUpdated({ form }) {
			if (form.valid) step = 1;
		}
	});

	const files = filesProxy(form, 'images');
</script>

<div class="mx-auto min-h-screen bg-gray-50 py-12 pt-64">
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
				style="width: {((step - 1) / totalSteps) * 100}%"
				class:rounded-tr-xl={step === totalSteps}
			></div>
		</div>

		<div class="flex flex-1 items-center justify-center">
			<form method="POST" enctype="multipart/form-data" use:enhance>
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
				{#if step === 1}
					<div class="max-w-3xl space-y-4">
						<h2 class="font-sourceserif text-3xl font-normal text-gray-900">
							Let's Find the <span
								class="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
								>Perfect Professional</span
							> for Your Project!
						</h2>
						<p class="text-sm text-gray-500">
							We'll help you find the perfect professional for your home improvement project. <br
							/> This will take about 3 minutes.
						</p>
					</div>
				{/if}

				<!-- Step 2: Project Details -->
				{#if step === 2}
					<div class="max-w-3xl space-y-6">
						<h2 class="font-sourceserif text-3xl font-normal text-gray-900">
							Tell us about your project
						</h2>
						<p class="text-sm text-gray-500">
							Create a brief description of the project to help us find the right expert.
						</p>

						<div>
							<label for="project-type" class="mb-2 block text-sm font-medium text-gray-700"
								>Project Type</label
							>
							<div class="relative">
								<select
									name="projectTypes"
									id="project-type"
									bind:value={$form.projectTypes}
									class="w-full appearance-none rounded-lg border border-gray-300 bg-[#f8f7f3] px-3 py-2 pr-12 focus:border-black focus:ring-black"
									required
								>
									<option value="">Select a project type</option>
									<option value="Cookies and cream">Cookies and cream</option>
									<option value="Mint choc chip">Mint choc chip</option>
									<option value="Raspberry ripple">Raspberry ripple</option>
								</select>

								<div
									class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
								>
									<svg
										class="h-4 w-4 fill-current"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
									>
										<path
											d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
										/>
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
								bind:value={$form.description}
								class="w-full rounded-lg border border-gray-300 bg-[#f8f7f3] px-3 py-2 focus:border-black focus:ring-black"
								rows="4"
								placeholder="Describe your project in detail..."
								required
							></textarea>
						</div>
					</div>
				{/if}

				<!-- Step 3: Project Details Images-->
				{#if step === 3}
					<div class="max-w-3xl space-y-6">
						<div class="space-y-4">
							<h2 class="font-sourceserif text-3xl font-normal text-gray-900">
								Upload photos (optional)
							</h2>
							<p class="text-sm text-gray-500">
								Help us help you! Upload images of the room or area you want to improve. This allows
								our professionals to provide a more accurate remote estimate and better understand
								your needs. The more details we have, the better we can match you with the right
								expert!
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
												bind:files={$files}
											/>
										</label>
										<p class="pl-1">or drag and drop</p>
									</div>
									<p class="text-xs text-gray-500">PNG, JPG up to 10MB</p>
								</div>
							</div>
							{#if $files.length > 0}
								<div class="mt-4 grid grid-cols-3 gap-4">
									{#each $files as file}
										<img
											src={URL.createObjectURL(file)}
											alt="Preview"
											class="h-24 w-full rounded-lg object-cover"
										/>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Step 4: Budget and Timeline -->
				{#if step === 4}
					<div class="mx-auto max-w-2xl space-y-6">
						<div class="space-y-4">
							<h2 class="font-roboto text-2xl font-normal text-gray-900">
								Budget and Timeline (optional)
							</h2>
							<p class="text-sm text-gray-500">
								Sharing your budget and preferred timeline helps us connect you with the right
								professionals who can meet your needs efficiently. This information ensures accurate
								estimates and smooth project planning from the start.
							</p>
						</div>

						<div class="max-w-sm">
							<label for="budget-range" class="mb-2 block text-sm font-medium text-gray-700"
								>Budget Range</label
							>
							<div class="relative">
								<select
									id="budget-range"
									bind:value={$form.budget}
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
								<div
									class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
								>
									<svg
										class="h-4 w-4 fill-current"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
									>
										<path
											d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
										/>
									</svg>
								</div>
							</div>
						</div>

						<div class="max-w-sm">
							<label for="timeline" class="mb-2 block text-sm font-medium text-gray-700"
								>Timeline</label
							>
							<div class="relative">
								<select
									id="timeline"
									bind:value={$form.timeline}
									class="w-full appearance-none rounded-lg border border-gray-300 bg-[#f8f7f3] px-3 py-2 pr-10 focus:border-black focus:ring-black"
									required
								>
									<option value="">When do you want to start?</option>
									<option value="immediately">Right away</option>
									<option value="1-2 weeks">Within 1-2 weeks</option>
									<option value="1 month">Within 1 month</option>
									<option value="2-3 months">2-3 months</option>
									<option value="planning">Just planning</option>
								</select>
								<div
									class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
								>
									<svg
										class="h-4 w-4 fill-current"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
									>
										<path
											d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
										/>
									</svg>
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- Step 5: About You -->
				{#if step === 5}
					<div class="mx-auto max-w-3xl space-y-6">
						<div class="space-y-4">
							<h2 class="font-roboto text-2xl font-normal text-gray-900">A little about you</h2>
							<p class="text-sm text-gray-500">
								For security purposes, we only collect your name, city, and state at this stage.
								Once you begin working with a tradesperson, we'll gather additional information
								to ensure a smooth and secure process.
							</p>
						</div>

						<div class="max-w-sm">
							<label for="name" class="mb-2 block text-sm font-medium text-gray-700">Name</label>
							<input
								id="name"
								type="text"
								bind:value={$form.name}
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
									bind:value={$form.city}
									class="w-full rounded-lg border border-gray-300 bg-[#f8f7f3] px-3 py-2 focus:border-black focus:ring-black"
									required
								/>
							</div>
							<div>
								<label for="state" class="mb-2 block text-sm font-medium text-gray-700">State</label
								>
								<input
									id="state"
									type="text"
									bind:value={$form.state}
									class="w-full rounded-lg border border-gray-300 bg-[#f8f7f3] px-3 py-2 focus:border-black focus:ring-black"
									required
								/>
							</div>
						</div>
					</div>
				{/if}

				<!-- Navigation buttons -->
				<div class="mt-8 flex justify-between">
					<div class="flex items-center gap-6">
						<button
							type="submit"
							class="flex items-center gap-2 rounded-3xl bg-[#ff6923] px-7 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#ff6923]/80"
						>
							{step == totalSteps ? 'Submit' : 'Next'}
						</button>
						<p class="flex items-center gap-1 text-xs font-extralight text-gray-600">
							<KeyReturn weight="fill" class="h-4 w-4 text-gray-300" /> or Press Enter
						</p>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>