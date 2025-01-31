<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { writable } from 'svelte/store';
    import { superForm, filesProxy } from 'sveltekit-superforms';
    import { zod } from 'sveltekit-superforms/adapters';
    import { FileArrowUp, CaretRight, Camera, KeyReturn, ArrowLeft, X } from 'phosphor-svelte';
    import { steps } from './schema';
    import { browser } from '$app/environment';

	export let data;

	let step = 1;
	$: options.validators = zod(steps[step - 1]);

	let totalSteps = steps.length;
	$: isLastStep = step === totalSteps;
	$: isFirstStep = step === 1;

	function nextStep() {
		if (step < totalSteps) {
			if (step === 4) {
                // Assuming step 4 is where timeline is selected
                // Prepare the timeline object before moving to the next step
                updateTimelineObject();
            }
			step = step + 1;
		}
	}

	function updateTimelineObject() {
        console.log("timeline is: ", $form.timeline)
        if ($form.timeline) {
            let startDate = new Date();
            switch ($form.timeline) {
                case '0w':
                    startDate = new Date();
                    break;
                case '2w':
                    startDate.setDate(startDate.getDate() + 14);
                    break;
                case '1m':
                    startDate.setMonth(startDate.getMonth() + 1);
                    break;
                case '2m':
                    startDate.setMonth(startDate.getMonth() + 2);
                    break;
                case '6m':
                    startDate.setMonth(startDate.getMonth() + 6);
                    break;
                default:
                    startDate.setDate(startDate.getDate() + 14); // Add 14 days (2 week)
                    break;
            }

            form.update(f => ({
                ...f,
                timeline: {
                    startDate: startDate,
                    endDate: undefined, // Or a calculated value based on startDate
                    completedDate: undefined
                }
            }));
        }
    }

	function prevStep() {
		if (step > 1) {
			step = step - 1;
		}
	}

	let budgetValue: number | undefined = undefined;
	let budgetDisplay = '';

	$: if (form) {
		console.log('form changed:', $form);
		budgetValue = $form.budget;
		console.log('budgetValue:', budgetValue);
	}

	function formatBudget(value?: number) {
		if (value === undefined) return '';
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		}).format(value);
	}

	$: budgetDisplay = formatBudget(budgetValue);

	function handleBudgetInput(event: Event) {
		const input = event.target as HTMLInputElement;
		let numericValue = parseInt(input.value.replace(/[^0-9]/g, ''));

		if (!isNaN(numericValue)) {
			budgetValue = numericValue;
		} else {
			budgetValue = undefined; // Reset if input is not a valid number
		}

		form.update((f) => ({ ...f, budget: budgetValue }));
	}

	const { form, errors, message, enhance, validateForm, options, reset } = superForm(data.form, {
		dataType: 'json',
		async onSubmit({ cancel, submitter }) {
			console.log('onSubmit triggered');

			// Validate the current step
			const result = await validateForm();
			console.log('Validation result:', result);

			if (!result.valid) {
				console.log('Form is invalid');
				cancel();
				return;
			}

			if (step < totalSteps) {
				// Proceed to the next step for intermediate steps
				console.log('Form is valid, calling nextStep()');
				nextStep();
				cancel();
			} else {
				// On the last step, allow form submission
				console.log('Last step, submitting form');
			}
		},
		async onResult({ result }) {
			console.log('Form submission result:', result);
			// Only show errors for non-redirect failures
			if (result.type === 'success') {
				// Reset the form
				reset();
				step = 1;
				// Navigate to success page on successful submission
				if (browser) {
					await goto('/project/success', { replaceState: true });
				}
			} else if (result.type === 'failure' && result.status !== 303) {
				console.error('Form submission failed:', result.data?.form?.errors || result);
			}
		},
		resetForm: true,
		taintedMessage: null,
		validators: zod(steps[step - 1])
	});

	$: serverError = $errors?.server;

	const files = filesProxy(form, 'images'); // Create the files proxy
</script>

<div class="mx-auto min-h-screen bg-gray-50 py-12 pt-64">
	<div
		class="relative mx-auto flex min-h-[600px] max-w-5xl flex-col overflow-hidden rounded-xl bg-[#f8f7f3] pb-24 shadow-xl"
	>
		<!-- ... header and progress bar ... -->

		<div class="flex flex-1 items-center justify-center">
			<form
				method="POST"
				enctype="multipart/form-data"
				use:enhance
				action={isLastStep ? '?/submitProject' : ''}
			>
				{#if serverError}
					<div class="mb-4 rounded-md bg-red-50 p-4">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
								</svg>
							</div>
							<div class="ml-3">
								<h3 class="text-sm font-medium text-red-800">Error</h3>
								<div class="mt-2 text-sm text-red-700">
									{serverError}
								</div>
							</div>
						</div>
					</div>
				{/if}

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
								<p>Back {step} of {totalSteps}</p>
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
							We'll help you find the perfect professional for your home improvement project. <br />
							This will take about 3 minutes.
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
							<label for="budget" class="mb-2 block text-sm font-medium text-gray-700">Budget</label>
							<div class="relative">
								<input
									type="text"
									id="budget"
									value={budgetDisplay}
									on:input={handleBudgetInput}
									class="w-full rounded-lg border border-gray-300 bg-[#f8f7f3] px-3 py-2 focus:border-black focus:ring-black"
									placeholder="$50,000"
								/>
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
									<option value="0">Right away</option>
									<option value="2">In 2 weeks</option>
									<option value="1">In 1 month</option>
									<option value="2">In 2 months</option>
									<option value="6">Still planning</option>
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
							<h2 class="font-roboto text-2xl font-normal text-gray-900">Location information</h2>
							<p class="text-sm text-gray-500">
								For security purposes, we only collect your name, city, and state at this stage.
								Once you begin working with a tradesperson, we'll gather additional information to
								ensure a smooth and secure process.
							</p>
						</div>

						<div class="max-w-sm">
							<label for="name" class="mb-2 block text-sm font-medium text-gray-700">Name</label>
							<input
								id="zipcode"
								type="text"
								bind:value={$form.zipcode}
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
						{#if !isLastStep}
							<button
								type="button"
								on:click={nextStep}
								class="flex items-center gap-2 rounded-3xl bg-[#ff6923] px-7 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#ff6923]/80"
							>
								Next
							</button>
						{:else}
						<button
						type="submit"
						formaction="?/submitProject"
						data-submit-form
						class="flex items-center gap-2 rounded-3xl bg-[#ff6923] px-7 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#ff6923]/80"
					>
						Submit
					</button>
						{/if}
						<p class="flex items-center gap-1 text-xs font-extralight text-gray-600">
							<KeyReturn weight="fill" class="h-4 w-4 text-gray-300" /> or Press Enter
						</p>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
