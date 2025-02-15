<!-- Projects listing page -->
<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { HouseLine } from 'phosphor-svelte';

	export let data;

	let activeTab = 'in-progress';

	$: projects = data.projects || {
		inProgress: [],
		completed: [],
		archived: [],
		reviews: []
	};

	function handleCreateProject() {
		goto('/projects/create');
	}

	function viewProject(projectId: string) {
		goto(`/projects/${projectId}`);
	}

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<div class="mx-auto max-w-5xl px-4 py-8 pt-64 sm:px-6 lg:px-8">
	<!-- Header with CTA -->
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-[28px] font-semibold text-gray-900">Projects</h1>
	</div>

	<section
		class="mb-24 grid max-h-56 grid-cols-5 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
	>
		<div class="col-span-2 p-0 pr-12">
			<div class="max-w-xl p-4 pl-8 text-left">
				<HouseLine class="my-3 h-6 w-6 text-[#ff6923]" weight="duotone" />
				<h2 class="text-[10pt] font-bold text-gray-900">Ready to Kickstart Your Project...</h2>

				<p class="hidden text-[9pt] font-light text-gray-500 md:mt-2 md:block">
					Let&apos;s Begin! We&apos;re here to help you find the perfect Pro for your home
					improvement needs.
				</p>

				<div class="mt-4 md:mt-4">
					<a
						href="#"
						class="text-thin inline-block rounded-lg bg-[#ff6923] px-5 py-3 font-roboto text-xs font-medium tracking-wide text-white transition"
					>
						Start a project
					</a>
				</div>
			</div>
		</div>

		<img alt="" src="default-project.png" class="col-span-3 w-full object-cover" />
	</section>

	<!-- No projects state -->
	{#if !projects.inProgress.length && !projects.completed.length && !projects.archived.length && !projects.reviews.length}
		<div class="rounded-lg bg-white py-12 text-center shadow-sm" in:fade>
			<div class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
				<svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
			</div>
			<h3 class="mb-2 text-lg font-medium text-gray-900">No projects yet!</h3>
			<p class="mb-4 text-sm text-gray-500">
				Time to start your first project and bring your ideas to life.
			</p>
			<button
				on:click={handleCreateProject}
				class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
			>
				Start a project
			</button>
		</div>
	{:else}
		<!-- Tabs -->
		<div class="mb-6 border-0 border-gray-200 pb-4">
			<nav class="flex space-x-8">
				<button
					class="medium py-0.5 text-[10pt] font-normal
                    {activeTab === 'in-progress'
						? 'rounded-full bg-black px-5 py-3 text-white'
						: 'rounded-full bg-gray-100 px-5 py-3 text-gray-900'}"
					on:click={() => (activeTab = 'in-progress')}
				>
					Active
					<!-- {#if projects.inProgress.length}
                        <span class="ml-2 py-0.5 px-1.5 rounded-full text-[8pt] font-medium bg-gray-100 text-gray-600">
                            {projects.inProgress.length}
                        </span>
                    {/if} -->
				</button>
				<button
					class="whitespace-nowrap text-[10pt] font-medium
                    {activeTab === 'completed'
						? 'rounded-full bg-black px-5 py-3 text-white'
						: 'rounded-full bg-gray-100 px-5 py-3 text-gray-900'}"
					on:click={() => (activeTab = 'completed')}
				>
					Completed
					<!-- {#if projects.completed.length}
                        <span class="ml-2 py-0.5 px-1.5 rounded-full text-[8pt] font-medium bg-gray-100 text-gray-600">
                            {projects.completed.length}
                        </span>
                    {/if} -->
				</button>
				<button
					class="whitespace-nowrap text-[10pt] font-medium
                    {activeTab === 'archived'
						? 'rounded-full bg-black px-5 py-3 text-white'
						: 'rounded-full bg-gray-100 px-5 py-3 text-gray-900'}"
					on:click={() => (activeTab = 'archived')}
				>
					Archived
					<!-- {#if projects.archived.length}
                        <span class="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            {projects.archived.length}
                        </span>
                    {/if} -->
				</button>
				<button
					class="whitespace-nowrap text-[10pt] font-medium
                    {activeTab === 'reviews'
						? 'bg-black text-white rounded-full px-5 py-3' 
                        : 'bg-gray-100 text-gray-900 rounded-full px-5 py-3'}"
					on:click={() => (activeTab = 'reviews')}
				>
					Reviews
					<!-- {#if projects.reviews.length}
                        <span class="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
                            {projects.reviews.length}
                        </span>
                    {/if} -->
				</button>
			</nav>
		</div>

		<!-- Project Grid -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#if activeTab === 'in-progress'}
				{#each projects.inProgress as project}
					<button
						class="cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
						on:click={() => viewProject(project._id)}
					>
						<div class="aspect-w-16 aspect-h-9">
							<img
								src={project.thumbnail || '/default-project.png'}
								alt={project.title}
								class="object-cover"
							/>
						</div>
						<div class="p-4">
							<h3 class="font-medium text-gray-900">{project.title}</h3>
							<div class="mt-1 text-sm text-gray-500">
								Started {formatDate(project.startDate)}
							</div>
							<div class="mt-4 flex items-center justify-between">
								<div class="flex items-center">
									<div class="flex-shrink-0">
										<img
											class="h-8 w-8 rounded-full"
											src={project.client?.image || '/default-image.png'}
											alt={project.client?.name || 'Client'}
										/>
									</div>
									<div class="ml-2">
										<p class="text-sm font-medium text-gray-900">
											{project.client?.name || 'Client'}
										</p>
									</div>
								</div>
								<div class="text-sm text-gray-500">
									{project.status}
								</div>
							</div>
						</div>
					</button>
				{/each}
			{:else if activeTab === 'completed'}
				{#each projects.completed as project}
					<button
						class="cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
						on:click={() => viewProject(project._id)}
					>
						<div class="aspect-w-16 aspect-h-9">
							<img
								src={project.thumbnail || '/default-project.png'}
								alt={project.title}
								class="object-cover"
							/>
						</div>
						<div class="p-4">
							<h3 class="font-medium text-gray-900">{project.title}</h3>
							<div class="mt-1 text-sm text-gray-500">
								Completed {formatDate(project.completionDate)}
							</div>
							<div class="mt-4 flex items-center justify-between">
								<div class="flex items-center">
									<div class="flex-shrink-0">
										<img
											class="h-8 w-8 rounded-full"
											src={project.client?.image || '/default-image.png'}
											alt={project.client?.name || 'Client'}
										/>
									</div>
									<div class="ml-2">
										<p class="text-sm font-medium text-gray-900">
											{project.client?.name || 'Client'}
										</p>
									</div>
								</div>
								<div class="text-sm font-medium text-green-600">Completed</div>
							</div>
						</div>
					</button>
				{/each}
			{:else if activeTab === 'archived'}
				{#each projects.archived as project}
					<button
						class="cursor-pointer overflow-hidden rounded-lg bg-white opacity-75 shadow-sm transition-shadow hover:shadow-md"
						on:click={() => viewProject(project._id)}
					>
						<div class="aspect-w-16 aspect-h-9 bg-gray-100">
							<img
								src={project.thumbnail || '/default-project.png'}
								alt={project.title}
								class="object-cover"
							/>
						</div>
						<div class="p-4">
							<h3 class="font-medium text-gray-900">{project.title}</h3>
							<div class="mt-1 text-sm text-gray-500">
								Archived {formatDate(project.updatedAt)}
							</div>
							<div class="mt-4 flex items-center justify-between">
								<div class="flex items-center">
									<div class="flex-shrink-0">
										<img
											class="h-8 w-8 rounded-full"
											src={project.client?.image || '/default-image.png'}
											alt={project.client?.name || 'Client'}
										/>
									</div>
									<div class="ml-2">
										<p class="text-sm font-medium text-gray-900">
											{project.client?.name || 'Client'}
										</p>
									</div>
								</div>
							</div>
						</div>
					</button>
				{/each}
			{:else}
				{#each projects.reviews as review}
					<button
						class="cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
						on:click={() => viewProject(review.project._id)}
					>
						<div class="p-4">
							<div class="mb-4 flex items-center">
								<div class="flex-shrink-0">
									<img
										class="h-10 w-10 rounded-full"
										src={review.reviewer?.image || '/default-image.png'}
										alt={review.reviewer?.name || 'Reviewer'}
									/>
								</div>
								<div class="ml-3">
									<p class="text-sm font-medium text-gray-900">
										{review.reviewer?.name || 'Reviewer'}
									</p>
									<p class="text-sm text-gray-500">{formatDate(review.date)}</p>
								</div>
							</div>
							<div class="mb-2 flex items-center">
								{#each Array(5) as _, i}
									<svg
										class="h-5 w-5 {i < review.rating ? 'text-yellow-400' : 'text-gray-300'}"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
										/>
									</svg>
								{/each}
							</div>
							<p class="text-sm text-gray-600">{review.comment}</p>
							<div class="mt-4 border-t border-gray-200 pt-4">
								<h4 class="text-sm font-medium text-gray-900">{review.project.title}</h4>
							</div>
						</div>
					</button>
				{/each}
			{/if}
		</div>
	{/if}
</div>
